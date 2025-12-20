/**
 * Book Audio Upload Service
 * سرویس آپلود صوت کتاب‌های دیجیتالی
 */

export interface UploadAudioResponse {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

/**
 * آپلود فایل صوتی کتاب
 * @param file فایل صوتی
 * @param onProgress تابع callback برای نشان دادن پیشرفت (0-100)
 */
export async function uploadBookAudio(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadAudioResponse> {
  // اعتبارسنجی نوع فایل
  const allowedTypes = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/webm",
    "audio/aac",
    "audio/m4a",
  ];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "فقط فایل‌های صوتی مجاز است (MP3, WAV, OGG, WebM, AAC, M4A)"
    );
  }

  // اعتبارسنجی حجم فایل (500MB)
  const MAX_SIZE = 500 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error("حجم فایل بیش از حد است. حداکثر 500MB مجاز است.");
  }

  // اعتبارسنجی پسوند
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (
    ![
      "mp3",
      "wav",
      "ogg",
      "webm",
      "aac",
      "m4a",
      "flac",
      "wma",
    ].includes(extension || "")
  ) {
    throw new Error("فایل باید دارای پسوند صوتی باشد");
  }

  // ایجاد FormData
  const formData = new FormData();
  formData.append("audio", file);

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
            reject(new Error(response.message || "خطا در آپلود فایل صوتی"));
          }
        } catch (error) {
          reject(new Error("خطا در تجزیه پاسخ سرور"));
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          reject(new Error(errorData.message || "خطا در آپلود فایل صوتی"));
        } catch (error) {
          reject(new Error("خطا در آپلود فایل صوتی"));
        }
      }
    });
    
    xhr.addEventListener("error", () => {
      reject(new Error("خطا در اتصال به سرور"));
    });
    
    xhr.addEventListener("abort", () => {
      reject(new Error("آپلود لغو شد"));
    });
    
    xhr.open("POST", `${fileUploadUrl}/api/admin/books/upload-audio`);
    xhr.send(formData);
  });
}

/**
 * حذف فایل صوتی از سرور
 * (اختیاری - برای استفاده آینده)
 */
export async function deleteBookAudio(fileUrl: string): Promise<void> {
  // این تابع می‌تواند بعداً برای حذف فایل‌های قدیمی استفاده شود
  // فعلاً فقط به صورت placeholder تعریف شده است
}
