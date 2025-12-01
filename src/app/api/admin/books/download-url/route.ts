import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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

function extractBucketAndKeyFromUrl(urlString: string) {
  try {
    const u = new URL(urlString);
    // path: /<bucket>/<key...>
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      const bucket = parts[0];
      const key = parts.slice(1).join('/');
      return { bucket, key };
    }
  } catch (e) {
    // ignore
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { filePath, expiresIn } = body as any;
    if (!filePath) return new NextResponse(JSON.stringify({ message: 'Missing filePath' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    // If S3 configured, attempt to presign a GET URL
    if (hasS3Config()) {
      let bucket = S3_BUCKET_NAME as string;
      let key = filePath as string;

      // If filePath is a full URL containing the bucket+path, extract it
      if (String(filePath).startsWith('http')) {
        const u = new URL(String(filePath));
        const s3Host = (S3_PUBLIC_ENDPOINT || S3_ENDPOINT || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
        if (s3Host && !u.hostname.endsWith(s3Host)) {
          // Not our S3 endpoint - return the URL directly (no presign)
          return NextResponse.json({ success: true, message: 'External URL', data: { url: filePath } });
        }
        const extracted = extractBucketAndKeyFromUrl(filePath);
        if (extracted) {
          bucket = extracted.bucket;
          key = extracted.key;
        } else {
          // Try to remove S3_PUBLIC_ENDPOINT prefix
          const prefix = (S3_PUBLIC_ENDPOINT || '').replace(/\/$/, '');
          if (filePath.startsWith(prefix)) {
            const trimmed = filePath.replace(prefix, '');
            const parts = trimmed.split('/').filter(Boolean);
            if (parts.length >= 2) {
              bucket = parts[0];
              key = parts.slice(1).join('/');
            }
          }
        }
      }

      const s3Client = new S3Client({
        region: S3_REGION,
        endpoint: S3_ENDPOINT,
        credentials: {
          accessKeyId: S3_ACCESS_KEY_ID as string,
          secretAccessKey: S3_SECRET_ACCESS_KEY as string,
        },
        forcePathStyle: true,
      });

      const command = new GetObjectCommand({ Bucket: bucket, Key: key });
      const expires = typeof expiresIn === 'number' ? Math.min(Math.max(expiresIn, 30), 60 * 60 * 24) : 60 * 5; // 5 min default
      const url = await getSignedUrl(s3Client, command, { expiresIn: expires });
      return NextResponse.json({ success: true, message: 'Download URL generated', data: { url, bucket, key, expiresAt: Date.now() + expires * 1000 } }, { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } });
    }

    // otherwise proxy to backend
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://www.pishrosarmaye.com/api') + '/admin/books/download-url';
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
    return new NextResponse(JSON.stringify(parsed), { status: res.status, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } });
  } catch (error) {
    console.error('Books download-url server error:', error);
    return new NextResponse(JSON.stringify({ message: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
