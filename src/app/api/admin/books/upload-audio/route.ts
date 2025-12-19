import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import {
  successResponse,
  validationError,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

// تنظیمات برای آپلود صوت کتاب
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/webm",
  "audio/aac",
  "audio/m4a",
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("audio") as File | null;

    if (!file) {
      return validationError(
        { audio: "فایل صوتی الزامی است" },
        "فایل صوتی الزامی است"
      );
    }

    // بررسی نوع فایل
    if (!ALLOWED_TYPES.includes(file.type)) {
      return validationError(
        { audio: "فقط فایل‌های صوتی مجاز هستند" },
        "فرمت‌های مجاز: MP3, WAV, OGG, WebM, AAC, M4A"
      );
    }

    // بررسی حجم فایل
    if (file.size > MAX_FILE_SIZE) {
      return validationError(
        { audio: "حجم فایل نباید بیشتر از 500 مگابایت باشد" },
        "حجم فایل نباید بیشتر از 500 مگابایت باشد"
      );
    }

    // تبدیل فایل به buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ایجاد نام منحصر به فرد برای فایل
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop() || "mp3";
    const filename = `audio_${timestamp}_${randomString}.${extension}`;

    // مسیر ذخیره فایل
    const uploadDir = join(process.cwd(), "public", "uploads", "books", "audio");
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
    const audioUrl = `/uploads/books/audio/${filename}`;

    return successResponse(
      {
        fileName: filename,
        fileUrl: audioUrl,
        fileSize: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
      },
      "فایل صوتی با موفقیت آپلود شد"
    );
  } catch (error) {
    console.error("Audio upload error:", error);
    return errorResponse(
      "خطایی در آپلود فایل صوتی رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
