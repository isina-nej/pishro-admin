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
  // برای فایل‌های بزرگ (48MB+)، timeout بایستی بزرگتر باشد
  const fileUploadUrl = process.env.NEXT_PUBLIC_FILE_UPLOAD_URL || "http://localhost:3001";
  const uploadEndpoint = `${fileUploadUrl}/api/admin/books/upload-pdf`;
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // پیگیری پیشرفت آپلود (فقط XMLHttpRequest این کار را صحیح انجام می‌دهد)
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        console.log(`📤 PDF Upload Progress: ${progress}% (${(event.loaded / (1024 * 1024)).toFixed(2)}MB / ${(event.total / (1024 * 1024)).toFixed(2)}MB)`);
        onProgress?.(progress);
      }
    });
    
    xhr.addEventListener("load", () => {
      if (xhr.status === 200 || xhr.status === 201) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.status === "success" && response.data) {
            console.log("✅ PDF uploaded successfully:", response.data);
            resolve(response.data);
          } else if (response.data) {
            // فرمت پاسخ بدون status field
            console.log("✅ PDF uploaded successfully:", response.data);
            resolve(response.data);
          } else {
            reject(new Error(response.message || "خطا در آپلود فایل PDF"));
          }
        } catch (error) {
          console.error("❌ Parse error:", xhr.responseText);
          reject(new Error("خطا در تجزیه پاسخ سرور"));
        }
      } else if (xhr.status === 413) {
        reject(new Error("فایل خیلی بزرگ است. حداکثر اندازه مجاز: 100MB"));
      } else if (xhr.status === 0) {
        reject(new Error("اتصال قطع شد. بررسی کنید آدرس سرور صحیح است"));
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          reject(new Error(errorData.message || `خطا در آپلود: کد ${xhr.status}`));
        } catch (error) {
          reject(new Error(`خطا در آپلود فایل PDF (کد خطا: ${xhr.status})`));
        }
      }
    });
    
    xhr.addEventListener("error", () => {
      console.error("❌ XHR Error - URL:", uploadEndpoint);
      reject(new Error("خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید"));
    });
    
    xhr.addEventListener("abort", () => {
      reject(new Error("آپلود لغو شد"));
    });
    
    try {
      xhr.open("POST", uploadEndpoint);
      console.log(`📁 Starting PDF upload (${(file.size / (1024 * 1024)).toFixed(2)}MB) to ${uploadEndpoint}`);
      xhr.send(formData);
    } catch (error) {
      console.error("❌ Error sending request:", error);
      reject(new Error("نتوانست درخواست را ارسال کند. آدرس سرور غلط است"));
    }
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
