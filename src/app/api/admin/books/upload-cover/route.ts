import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import {
  successResponse,
  validationError,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

// تنظیمات برای آپلود کاور کتاب
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("cover") as File | null;

    if (!file) {
      return validationError(
        { cover: "فایل تصویر الزامی است" },
        "فایل تصویر کاور الزامی است"
      );
    }

    // بررسی نوع فایل
    if (!ALLOWED_TYPES.includes(file.type)) {
      return validationError(
        { cover: "فقط فایل‌های تصویری مجاز هستند" },
        "فقط فرمت‌های JPG، PNG و WebP مجاز هستند"
      );
    }

    // بررسی حجم فایل
    if (file.size > MAX_FILE_SIZE) {
      return validationError(
        { cover: "حجم فایل نباید بیشتر از 5 مگابایت باشد" },
        "حجم فایل نباید بیشتر از 5 مگابایت باشد"
      );
    }

    // تبدیل فایل به buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ایجاد نام منحصر به فرد برای فایل
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop() || "jpg";
    const filename = `cover_${timestamp}_${randomString}.${extension}`;

    // مسیر ذخیره فایل
    const uploadDir = join(process.cwd(), "public", "uploads", "books", "covers");
    const filepath = join(uploadDir, filename);

    // ایجاد دایرکتوری اگر وجود ندارد
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error("Error creating directory:", err);
    }

    // ذخیره فایل
    await writeFile(filepath, buffer);

    // URL نسبی فایل
    const coverUrl = `/uploads/books/covers/${filename}`;

    return successResponse(
      {
        fileName: filename,
        fileUrl: coverUrl,
        fileSize: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
      },
      "تصویر کاور با موفقیت آپلود شد"
    );
  } catch (error) {
    console.error("Cover upload error:", error);
    return errorResponse(
      "خطایی در آپلود تصویر کاور رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
