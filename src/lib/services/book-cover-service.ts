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
 * @param file فایل تصویر
 * @param onProgress تابع callback برای نشان دادن پیشرفت (0-100)
 */
export async function uploadBookCover(
  file: File,
  onProgress?: (progress: number) => void
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
          if (response.data) {
            resolve(response.data);
          } else {
            reject(new Error(response.message || "خطا در آپلود فایل کاور"));
          }
        } catch (error) {
          reject(new Error("خطا در تجزیه پاسخ سرور"));
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          reject(new Error(errorData.message || "خطا در آپلود فایل کاور"));
        } catch (error) {
          reject(new Error("خطا در آپلود فایل کاور"));
        }
      }
    });
    
    xhr.addEventListener("error", () => {
      reject(new Error("خطا در اتصال به سرور"));
    });
    
    xhr.addEventListener("abort", () => {
      reject(new Error("آپلود لغو شد"));
    });
    
    xhr.open("POST", `${fileUploadUrl}/api/admin/books/upload-cover`);
    xhr.send(formData);
  });
}

/**
 * حذف فایل کاور از سرور
 * (اختیاری - برای استفاده آینده)
 */
export async function deleteBookCover(fileUrl: string): Promise<void> {
  // این تابع می‌تواند بعداً برای حذف فایل‌های قدیمی استفاده شود
  // فعلاً فقط به صورت placeholder تعریف شده است
}
