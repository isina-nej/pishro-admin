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
 * @param file فایل PDF
 * @param onProgress تابع callback برای نشان دادن پیشرفت (0-100)
 */
export async function uploadBookPdf(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadPdfResponse> {
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

  // ارسال درخواست به pishro2 server با XMLHttpRequest برای نشان دادن پیشرفت
  const fileUploadUrl = process.env.NEXT_PUBLIC_FILE_UPLOAD_URL || "http://localhost:3001";
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // پیگیری پیشرفت آپلود
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress?.(progress);
      }
    });
    
    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.status === "success") {
            resolve(response.data);
          } else {
            reject(new Error(response.message || "خطا در آپلود فایل PDF"));
          }
        } catch (error) {
          reject(new Error("خطا در تجزیه پاسخ سرور"));
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          reject(new Error(errorData.message || "خطا در آپلود فایل PDF"));
        } catch (error) {
          reject(new Error("خطا در آپلود فایل PDF"));
        }
      }
    });
    
    xhr.addEventListener("error", () => {
      reject(new Error("خطا در اتصال به سرور"));
    });
    
    xhr.addEventListener("abort", () => {
      reject(new Error("آپلود لغو شد"));
    });
    
    xhr.open("POST", `${fileUploadUrl}/api/admin/books/upload-pdf`);
    xhr.send(formData);
  });
}

/**
 * حذف فایل PDF از سرور
 * (اختیاری - برای استفاده آینده)
 */
export async function deleteBookPdf(fileUrl: string): Promise<void> {
  // این تابع می‌تواند بعداً برای حذف فایل‌های قدیمی استفاده شود
  // فعلاً فقط به صورت placeholder تعریف شده است
}
