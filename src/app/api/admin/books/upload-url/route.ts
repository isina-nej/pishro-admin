import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// If S3 env configuration is available, generate a presigned PUT URL server-side;
// otherwise fallback to proxy the request to an external backend (if configured).

const S3_ENDPOINT = process.env.S3_ENDPOINT;
const S3_REGION = process.env.S3_REGION || 'default';
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
const S3_PUBLIC_ENDPOINT = process.env.S3_PUBLIC_ENDPOINT || S3_ENDPOINT;
const NEXT_PUBLIC_ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_BASE_URL || '*';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': NEXT_PUBLIC_ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

function hasS3Config() {
  return !!(S3_ENDPOINT && S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY && S3_BUCKET_NAME);
}

function normalizeExt(ext: string) {
  return ext.trim().toLowerCase().replace(/^[.]/, '');
}

function inferContentType(ext: string) {
  const e = normalizeExt(ext);
  switch (e) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    case 'avif':
      return 'image/avif';
    case 'pdf':
      return 'application/pdf';
    case 'epub':
      return 'application/epub+zip';
    case 'mobi':
    case 'azw3':
    case 'm4b':
      return 'application/octet-stream';
    case 'mp3':
      return 'audio/mpeg';
    case 'wav':
      return 'audio/wav';
    default:
      return 'application/octet-stream';
  }
}

/**
 * POST /api/admin/books/upload-url
 * Body: { fileName, fileSize, fileFormat, resourceType, title? }
 */
export async function POST(request: Request) {
    // Safe debug only: method, origin, and if S3 config is present (don't log secrets)
    try {
      const origin = request.headers.get('origin');
      console.log('[DEBUG upload-url] incoming POST', { origin, route: '/api/admin/books/upload-url', s3Configured: hasS3Config() });
    } catch (e) {
      // ignore
    }
  try {
    let body: any = null;
    try {
      body = await request.json();
    } catch (err) {
      console.error('[DEBUG] Failed to parse JSON body', err);
      return new NextResponse(JSON.stringify({ message: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    // Basic validation
    const { fileName, fileSize, fileFormat, resourceType, title } = body as any;
    if (!fileName || !fileFormat || !fileSize || !resourceType) {
      return new NextResponse(JSON.stringify({ message: 'Missing required inputs' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Basic file format validation
    const ext = normalizeExt(fileFormat || (fileName.split('.').pop() || ''));
    const allowedFormats: Record<string, string[]> = {
      cover: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
      file: ['pdf', 'epub', 'mobi', 'azw3'],
      audio: ['mp3', 'wav', 'm4a', 'ogg'],
    };
    if (!allowedFormats[resourceType] || !allowedFormats[resourceType].includes(ext)) {
      return new NextResponse(JSON.stringify({ message: 'Unsupported file format' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Size limits (bytes). These should align with client-side expectations and backend policies
    const sizeLimits: Record<string, number> = {
      cover: 100 * 1024 * 1024, // 100 MB
      file: 256 * 1024 * 1024, // 256 MB for book files
      audio: 5 * 1024 * 1024 * 1024, // 5 GB
    };
    const max = sizeLimits[resourceType] ?? 256 * 1024 * 1024;
    if (fileSize > max) {
      return new NextResponse(JSON.stringify({ message: 'File too large' }), { status: 413, headers: { 'Content-Type': 'application/json' } });
    }

    // If we have S3 credentials, generate signed URL locally
    if (hasS3Config()) {
      // Use AWS SDKv3 S3 client with custom endpoint (S3-compatible)
      const s3Client = new S3Client({
        region: S3_REGION,
        endpoint: S3_ENDPOINT,
        credentials: {
          accessKeyId: S3_ACCESS_KEY_ID as string,
          secretAccessKey: S3_SECRET_ACCESS_KEY as string,
        },
        forcePathStyle: true,
      });

      // Build a unique id and key
      const id = randomUUID();
      const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const key = `books/${resourceType}/${id}/${safeFileName}`;

      const contentType = body.contentType || inferContentType(ext);
      const command = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
        ContentType: contentType,
      });

      const expiresIn = 60 * 60; // 1 hour
      let uploadUrl: string;
      try {
        uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });
      } catch (s3Error) {
        // Provide a more detailed error response for easier troubleshooting
        console.error('[DEBUG upload-url] getSignedUrl failed', { s3Error: s3Error && (s3Error as any).message });
        return new NextResponse(JSON.stringify({ message: 'Failed to generate signed URL', details: (s3Error as any)?.message || String(s3Error) }), { status: 502, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } });
      }

      const storagePath = key; // relative path in bucket
      // When using a public endpoint, include the bucket name in the public URL
      const storageUrl = (S3_PUBLIC_ENDPOINT || S3_ENDPOINT || '').replace(/\/$/, '') + '/' + S3_BUCKET_NAME + '/' + storagePath;

      return NextResponse.json({
        success: true,
        message: 'Upload URL generated',
          data: {
          uploadUrl,
          fileId: id,
          storagePath,
          storageUrl,
          uniqueFileName: `${id}-${safeFileName}`,
          expiresAt: Date.now() + expiresIn * 1000,
          metadata: {
            title: title || null,
            fileSize,
            fileFormat,
            resourceType,
          },
        },
      }, { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } });
    }

    // Otherwise fallback to proxy to configured backend (e.g. NEXT_PUBLIC_API_URL)
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://www.pishrosarmaye.com/api') + '/admin/books/upload-url';
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const auth = request.headers.get('authorization');
    if (auth) headers['authorization'] = auth;
    const cookie = request.headers.get('cookie');
    if (cookie) headers['cookie'] = cookie;
    request.headers.forEach((value, key) => {
      if (key.startsWith('x-')) headers[key] = value;
    });

    const res = await fetch(backendUrl, { method: 'POST', headers, body: JSON.stringify(body) });
    const resBody = await res.text();
    let parsed: any = resBody;
    try { parsed = JSON.parse(resBody); } catch (e) { parsed = resBody; }
    if (!res.ok) {
      console.error('[DEBUG upload-url] Backend upload-url proxy returned error', { backendUrl, status: res.status, body: resBody });
    }
    return new NextResponse(JSON.stringify(parsed), { status: res.status, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } });
  } catch (error) {
  console.error('Books upload-url server error:', error);
    return new NextResponse(JSON.stringify({ message: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } });
  }
}

export async function OPTIONS() {
  try {
    console.log('[DEBUG upload-url] OPTIONS preflight', { route: '/api/admin/books/upload-url' });
  } catch (e) {}
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
