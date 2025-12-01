const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

async function main() {
  const S3_ENDPOINT = process.env.S3_ENDPOINT || "https://teh-1.s3.poshtiban.com";
  const S3_REGION = process.env.S3_REGION || 'default';
  const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'videos';
  const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY || '';
  const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || '';

  if (!S3_ENDPOINT || !S3_BUCKET_NAME || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY) {
    console.error('Missing S3 env vars. Provide S3_ENDPOINT, S3_BUCKET_NAME, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY.');
    process.exit(1);
  }

  const s3 = new S3Client({
    region: S3_REGION,
    endpoint: S3_ENDPOINT,
    credentials: { accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY },
    forcePathStyle: true,
  });

  const key = `books/file/testfile-${Date.now()}.txt`;
  const command = new PutObjectCommand({ Bucket: S3_BUCKET_NAME, Key: key, ContentType: 'text/plain' });
  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    console.log('Signed URL:', url);
    console.log('Storage URL:', `${S3_ENDPOINT.replace(/\/$/, '')}/${key}`);
  } catch (err) {
    console.error('Presign error:', err);
  }
}

main();
