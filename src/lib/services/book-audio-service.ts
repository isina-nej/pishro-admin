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

  // ارسال درخواست به pishro2 server با fetch برای بهتری CORS و reliability
  const fileUploadUrl = process.env.NEXT_PUBLIC_FILE_UPLOAD_URL || "http://localhost:3001";
  const uploadEndpoint = `${fileUploadUrl}/api/admin/books/upload-audio`;
  
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const uploadTimeout = setTimeout(() => {
      controller.abort();
      reject(new Error("مهلت زمانی آپلود به پایان رسید. لطفاً دوباره تلاش کنید"));
    }, 120000); // 120 second timeout for audio files

    // استفاده از fetch API برای آپلود بهتر
    fetch(uploadEndpoint, {
      method: "POST",
      body: formData,
      credentials: "include", // شامل کردن cookies برای احراز هویت
      signal: controller.signal,
    })
      .then(async (response) => {
        clearTimeout(uploadTimeout);
        
        const contentType = response.headers.get("content-type");
        let data;
        
        try {
          if (contentType?.includes("application/json")) {
            data = await response.json();
          } else {
            data = await response.text();
          }
        } catch (error) {
          reject(new Error("خطا در تجزیه پاسخ سرور"));
          return;
        }

        if (response.ok) {
          if (typeof data === "object" && data.status === "success" && data.data) {
            // اگر پاسخ ساختار مورد انتظار را داشته باشد
            resolve(data.data);
          } else if (typeof data === "object" && data.data) {
            // اگر به سادگی فقط data داشته باشد
            resolve(data.data);
          } else if (typeof data === "object" && data.fileUrl) {
            // اگر داده مستقیماً فایل URL باشد
            resolve(data);
          } else {
            reject(new Error("پاسخ سرور معتبر نیست"));
          }
        } else {
          const errorMessage = 
            (typeof data === "object" && data.message) || 
            `خطا در آپلود فایل صوتی (کد خطا: ${response.status})`;
          reject(new Error(errorMessage));
        }
      })
      .catch((error) => {
        clearTimeout(uploadTimeout);
        
        if (error.name === "AbortError") {
          reject(new Error("آپلود لغو شد"));
        } else if (error instanceof TypeError) {
          console.error("Upload fetch error - URL:", uploadEndpoint, "Error:", error);
          reject(new Error("خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید"));
        } else {
          reject(error);
        }
      });

    // برای نمایش پیشرفت، ما نمی‌توانیم با fetch استاندارد استفاده کنیم
    // اگر نیاز به پیشرفت باشد، بایستی از ReadableStream استفاده کنیم
    if (onProgress) {
      onProgress(50); // نمایش پیشرفت تخمینی
    }
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
