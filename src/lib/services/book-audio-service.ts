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
 */
export async function uploadBookAudio(
  file: File
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

  // ارسال درخواست به pishro2 server
  const fileUploadUrl = process.env.NEXT_PUBLIC_FILE_UPLOAD_URL || "http://localhost:3001";
  const response = await fetch(`${fileUploadUrl}/api/admin/books/upload-audio`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "خطا در آپلود فایل صوتی");
  }

  const data = await response.json();

  // بررسی وجود data در response
  if (!data || !data.data) {
    throw new Error(data?.message || "خطا در آپلود فایل صوتی");
  }

  return data.data;
}

/**
 * حذف فایل صوتی از سرور
 * (اختیاری - برای استفاده آینده)
 */
export async function deleteBookAudio(fileUrl: string): Promise<void> {
  // این تابع می‌تواند بعداً برای حذف فایل‌های قدیمی استفاده شود
  // فعلاً فقط به صورت placeholder تعریف شده است
}
