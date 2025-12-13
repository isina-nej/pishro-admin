/**
 * PDF Upload API Endpoint
 * برای آپلود PDF‌های CMS
 * مسیر: /api/uploads/pdf
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'pdfs');
const TEMP_DIR = path.join(process.cwd(), 'public', 'uploads', 'temp');
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export async function POST(request: NextRequest) {
  try {
    // تأیید کاربر (اضافه کن به صورت اختیاری)
    // const user = await getServerSession();
    // if (!user?.user?.role?.includes('admin')) {
    //   return NextResponse.json(
    //     { error: 'دسترسی غیرمجاز' },
    //     { status: 401 }
    //   );
    // }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'فایل آپلود نشده است' },
        { status: 400 }
      );
    }

    // بررسی نوع فایل
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'فقط فایل‌های PDF مجاز هستند' },
        { status: 400 }
      );
    }

    // بررسی حجم فایل
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `حجم فایل نمی‌تواند از ${MAX_FILE_SIZE / (1024 * 1024)} MB بیشتر باشد` },
        { status: 400 }
      );
    }

    // ایجاد نام فایل منحصر به فرد
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const fileName = `${timestamp}-${randomStr}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // ایجاد دایرکتوری اگر وجود ندارد
    try {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
    } catch (error) {
      console.error('Error creating directory:', error);
    }

    // ذخیره فایل
    const buffer = await file.arrayBuffer();
    await fs.writeFile(filePath, new Uint8Array(buffer));

    return NextResponse.json(
      {
        success: true,
        fileName: fileName,
        originalName: file.name,
        url: `/uploads/pdfs/${fileName}`,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PDF upload error:', error);
    return NextResponse.json(
      { error: 'خطا در آپلود فایل' },
      { status: 500 }
    );
  }
}

/**
 * دستور تست با curl:
 * curl -X POST http://localhost:3000/api/uploads/pdf \
 *   -F "file=@/path/to/file.pdf"
 */
