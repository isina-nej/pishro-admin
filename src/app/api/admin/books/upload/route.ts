import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

const S3_ENDPOINT = process.env.S3_ENDPOINT;
const S3_REGION = process.env.S3_REGION || 'default';
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
const S3_PUBLIC_ENDPOINT = process.env.S3_PUBLIC_ENDPOINT || S3_ENDPOINT;
const NEXT_PUBLIC_ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_BASE_URL || '*';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': NEXT_PUBLIC_ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
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
    case 'mp3':
      return 'audio/mpeg';
    case 'wav':
      return 'audio/wav';
    default:
      return 'application/octet-stream';
  }
}

export async function POST(request: Request) {
  try {
    console.log('[DEBUG upload] incoming POST');
    if (!hasS3Config()) {
      return new NextResponse(JSON.stringify({ message: 'S3 not configured' }), { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } });
    }

    // parse multipart form data; Next.js provides request.formData() which returns web-standard FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const resourceType = (formData.get('resourceType') as string) || 'file';
    const title = (formData.get('title') as string) || null;

    if (!file) {
      return new NextResponse(JSON.stringify({ message: 'Missing file' }), { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } });
    }

    // Basic file validation
    const fileName = formData.get('fileName') as string || file.name || `file-${Date.now()}`;
    const fileSize = file.size || 0;
    const ext = (fileName.split('.').pop() || '').toLowerCase();
    const allowedFormats: Record<string, string[]> = {
      cover: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
      file: ['pdf', 'epub', 'mobi', 'azw3'],
      audio: ['mp3', 'wav', 'm4a', 'ogg'],
    };
    const configFormats = allowedFormats[resourceType] || allowedFormats.file;
    if (configFormats.length && !configFormats.includes(ext)) {
      return new NextResponse(JSON.stringify({ message: 'Unsupported file format' }), { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } });
    }

    const id = randomUUID();
    const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `books/${resourceType}/${id}/${safeFileName}`;

    const contentType = inferContentType(ext || (file.type || ''));

    // Build S3 client
    const s3Client = new S3Client({
      region: S3_REGION,
      endpoint: S3_ENDPOINT,
      credentials: { accessKeyId: S3_ACCESS_KEY_ID as string, secretAccessKey: S3_SECRET_ACCESS_KEY as string },
      forcePathStyle: true,
    });

    // Read file body to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const command = new PutObjectCommand({ Bucket: S3_BUCKET_NAME, Key: key, ContentType: contentType, Body: buffer });
    await s3Client.send(command);

    const storagePath = key;
    const storageUrl = (S3_PUBLIC_ENDPOINT || S3_ENDPOINT || '').replace(/\/$/, '') + '/' + S3_BUCKET_NAME + '/' + storagePath;

    return new NextResponse(JSON.stringify({ success: true, data: { fileId: id, storagePath, storageUrl, uniqueFileName: `${id}-${safeFileName}`, metadata: { title, fileSize, fileFormat: ext, resourceType } } }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } });
  } catch (err) {
    console.error('Books upload server error:', err);
    return new NextResponse(JSON.stringify({ message: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
