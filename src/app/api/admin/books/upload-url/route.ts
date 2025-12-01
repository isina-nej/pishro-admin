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

function hasS3Config() {
  return !!(S3_ENDPOINT && S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY && S3_BUCKET_NAME);
}

/**
 * POST /api/admin/books/upload-url
 * Body: { fileName, fileSize, fileFormat, resourceType, title? }
 */
export async function POST(request: Request) {
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

      const command = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
        ContentType: body.contentType || `application/${fileFormat}`,
      });

      const expiresIn = 60 * 60; // 1 hour
      const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });

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
      });
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
    return new NextResponse(JSON.stringify(parsed), { status: res.status, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
  console.error('Books upload-url server error:', error);
    return new NextResponse(JSON.stringify({ message: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
