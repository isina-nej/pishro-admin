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
  const uploadEndpoint = `${fileUploadUrl}/api/admin/books/upload-cover`;
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const uploadTimeout = setTimeout(() => {
      xhr.abort();
      reject(new Error("مهلت زمانی آپلود به پایان رسید. لطفاً دوباره تلاش کنید"));
    }, 60000); // 60 second timeout for images
    
    // پیگیری پیشرفت آپلود
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress?.(progress);
      }
    });
    
    xhr.addEventListener("load", () => {
      clearTimeout(uploadTimeout);
      if (xhr.status === 200 || xhr.status === 201) {
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
          reject(new Error(`خطا در آپلود فایل کاور (کد خطا: ${xhr.status})`));
        }
      }
    });
    
    xhr.addEventListener("error", () => {
      clearTimeout(uploadTimeout);
      console.error("Upload XHR Error - URL:", uploadEndpoint);
      reject(new Error("خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید"));
    });
    
    xhr.addEventListener("abort", () => {
      clearTimeout(uploadTimeout);
      reject(new Error("آپلود لغو شد"));
    });
    
    try {
      xhr.open("POST", uploadEndpoint);
      xhr.send(formData);
    } catch (error) {
      clearTimeout(uploadTimeout);
      reject(new Error("نتوانست درخواست را ارسال کند. آدرس سرور غلط است"));
    }
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
