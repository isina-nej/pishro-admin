/**
 * Book Cover Upload Service
 * سرویس آپلود کاور کتاب‌های دیجیتالی
 */

export interface UploadCoverResponse {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

/**
 * آپلود فایل کاور کتاب
 */
export async function uploadBookCover(
  file: File
): Promise<UploadCoverResponse> {
  // اعتبارسنجی نوع فایل
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("فقط فایل‌های تصویری مجاز است (JPG, PNG, WebP)");
  }

  // اعتبارسنجی حجم فایل (5MB)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error("حجم فایل بیش از حد است. حداکثر 5MB مجاز است.");
  }

  // اعتبارسنجی پسوند
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!["jpg", "jpeg", "png", "webp"].includes(extension || "")) {
    throw new Error("فایل باید دارای پسوند تصویری باشد");
  }

  // ایجاد FormData
  const formData = new FormData();
  formData.append("cover", file);

  // ارسال درخواست به pishro2 server
  const fileUploadUrl = process.env.NEXT_PUBLIC_FILE_UPLOAD_URL || "http://localhost:3001";
  const response = await fetch(`${fileUploadUrl}/api/admin/books/upload-cover`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "خطا در آپلود فایل کاور"
    );
  }

  const data = await response.json();

  // بررسی وجود data در response
  if (!data || !data.data) {
    throw new Error(data?.message || "خطا در آپلود فایل کاور");
  }

  return data.data;
}

/**
 * حذف فایل کاور از سرور
 * (اختیاری - برای استفاده آینده)
 */
export async function deleteBookCover(fileUrl: string): Promise<void> {
  // این تابع می‌تواند بعداً برای حذف فایل‌های قدیمی استفاده شود
  // فعلاً فقط به صورت placeholder تعریف شده است
}
