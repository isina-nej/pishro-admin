/**
 * Book PDF Upload Service
 * سرویس آپلود PDF برای کتاب‌های دیجیتالی
 */

export interface UploadPdfResponse {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

/**
 * آپلود فایل PDF کتاب
 */
export async function uploadBookPdf(file: File): Promise<UploadPdfResponse> {
  // اعتبارسنجی نوع فایل
  if (file.type !== "application/pdf") {
    throw new Error("فقط فایل‌های PDF مجاز است");
  }

  // اعتبارسنجی حجم فایل (100MB)
  const MAX_SIZE = 100 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error("حجم فایل بیش از حد است. حداکثر 100MB مجاز است.");
  }

  // اعتبارسنجی پسوند
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension !== "pdf") {
    throw new Error("فایل باید دارای پسوند .pdf باشد");
  }

  // ایجاد FormData
  const formData = new FormData();
  formData.append("pdf", file);

  // ارسال درخواست
  const response = await fetch("/api/admin/books/upload-pdf", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "خطا در آپلود فایل PDF"
    );
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || "خطا در آپلود فایل PDF");
  }

  return data.data;
}

/**
 * حذف فایل PDF از سرور
 * (اختیاری - برای استفاده آینده)
 */
export async function deleteBookPdf(fileUrl: string): Promise<void> {
  // این تابع می‌تواند بعداً برای حذف فایل‌های قدیمی استفاده شود
  // فعلاً فقط به صورت placeholder تعریف شده است
}
