import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import {
  successResponse,
  validationError,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

// تنظیمات برای آپلود PDF
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = ["application/pdf"];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File | null;

    if (!file) {
      return validationError(
        { pdf: "فایل PDF الزامی است" },
        "فایل PDF الزامی است"
      );
    }

    // بررسی نوع فایل
    if (!ALLOWED_TYPES.includes(file.type)) {
      return validationError(
        { pdf: "فقط فایل‌های PDF مجاز هستند" },
        "فقط فایل‌های PDF مجاز هستند"
      );
    }

    // بررسی حجم فایل
    if (file.size > MAX_FILE_SIZE) {
      return validationError(
        { pdf: "حجم فایل نباید بیشتر از 100 مگابایت باشد" },
        "حجم فایل نباید بیشتر از 100 مگابایت باشد"
      );
    }

    // بررسی پسوند
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension !== "pdf") {
      return validationError(
        { pdf: "فایل باید دارای پسوند .pdf باشد" },
        "فایل باید دارای پسوند .pdf باشد"
      );
    }

    // تبدیل فایل به buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ایجاد نام منحصر به فرد برای فایل
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const filename = `book_${timestamp}_${randomString}.pdf`;

    // مسیر ذخیره فایل
    const uploadDir = join(process.cwd(), "public", "uploads", "books", "pdfs");
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
    const pdfUrl = `/uploads/books/pdfs/${filename}`;

    return successResponse(
      {
        fileName: filename,
        fileUrl: pdfUrl,
        fileSize: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
      },
      "فایل PDF با موفقیت آپلود شد"
    );
  } catch (error) {
    console.error("PDF upload error:", error);
    return errorResponse(
      "خطایی در آپلود فایل PDF رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
