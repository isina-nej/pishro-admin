/**
 * Book PDF Upload Service with Chunked Upload
 * سرویس آپلود PDF برای کتاب‌های دیجیتالی با آپلود تکه‌ای
 */

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB هر تکه
const MAX_PARALLEL_CHUNKS = 3; // حداکثر 3 تکه به صورت موازی

export interface UploadPdfResponse {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

/**
 * تقسیم فایل به تکه‌های 5MB
 */
function* chunkFile(file: File): Generator<Blob> {
  for (let offset = 0; offset < file.size; offset += CHUNK_SIZE) {
    yield file.slice(offset, offset + CHUNK_SIZE);
  }
}

/**
 * آپلود یک تکه فایل
 */
async function uploadChunk(
  fileUploadUrl: string,
  fileId: string,
  chunk: Blob,
  chunkIndex: number,
  totalChunks: number,
  fileName: string,
  fileSize: number
): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append("chunk", chunk);
    formData.append("chunkIndex", chunkIndex.toString());
    formData.append("totalChunks", totalChunks.toString());
    formData.append("fileId", fileId);
    formData.append("fileName", fileName);
    formData.append("fileSize", fileSize.toString());

    xhr.addEventListener("load", () => {
      if (xhr.status === 200 || xhr.status === 201) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.status === "success" && response.data) {
            resolve(response.data);
          } else {
            reject(new Error(response.message || "خطا در آپلود تکه"));
          }
        } catch (error) {
          reject(new Error("خطا در تجزیه پاسخ سرور"));
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          reject(new Error(errorData.message || `خطا: کد ${xhr.status}`));
        } catch (error) {
          reject(new Error(`خطا در آپلود تکه (کد خطا: ${xhr.status})`));
        }
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("خطا در اتصال به سرور"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("آپلود تکه لغو شد"));
    });

    const uploadEndpoint = `${fileUploadUrl}/api/admin/books/upload-pdf-chunk`;
    xhr.open("POST", uploadEndpoint);
    xhr.send(formData);
  });
}

/**
 * اختتام آپلود و ترکیب تکه‌ها
 */
async function finalizePdfUpload(
  fileUploadUrl: string,
  fileId: string,
  totalChunks: number,
  fileName: string,
  fileSize: number
): Promise<UploadPdfResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("load", () => {
      if (xhr.status === 200 || xhr.status === 201) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.status === "success" && response.data) {
            console.log("✅ PDF finalized successfully:", response.data);
            resolve(response.data);
          } else {
            reject(new Error(response.message || "خطا در اختتام آپلود"));
          }
        } catch (error) {
          reject(new Error("خطا در تجزیه پاسخ سرور"));
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          reject(new Error(errorData.message || `خطا: کد ${xhr.status}`));
        } catch (error) {
          reject(new Error(`خطا در اختتام آپلود (کد خطا: ${xhr.status})`));
        }
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("خطا در اتصال به سرور"));
    });

    const uploadEndpoint = `${fileUploadUrl}/api/admin/books/finalize-pdf-upload`;
    xhr.open("POST", uploadEndpoint);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
      JSON.stringify({
        fileId,
        totalChunks,
        fileName,
        fileSize,
      })
    );
  });
}

/**
 * آپلود فایل PDF کتاب با آپلود تکه‌ای برای سرعت بیشتر
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

  const fileUploadUrl =
    process.env.NEXT_PUBLIC_FILE_UPLOAD_URL || "http://localhost:3001";
  const fileId = `pdf_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

  // تقسیم فایل به تکه‌ها
  const chunks = Array.from(chunkFile(file));
  const totalChunks = chunks.length;

  console.log(
    `📁 Starting chunked PDF upload: ${(file.size / (1024 * 1024)).toFixed(2)}MB in ${totalChunks} chunks`
  );

  let uploadedBytes = 0;

  // آپلود تکه‌ها به صورت موازی (حداکثر 3 تکه همزمان)
  for (let i = 0; i < totalChunks; i += MAX_PARALLEL_CHUNKS) {
    const parallelChunks = chunks.slice(
      i,
      Math.min(i + MAX_PARALLEL_CHUNKS, totalChunks)
    );

    const uploadPromises = parallelChunks.map((chunk, index) => {
      const chunkIndex = i + index;
      return uploadChunk(
        fileUploadUrl,
        fileId,
        chunk,
        chunkIndex,
        totalChunks,
        file.name,
        file.size
      ).then((result) => {
        uploadedBytes += chunk.size;
        const progress = Math.round((uploadedBytes / file.size) * 100);
        console.log(
          `📦 Chunk ${chunkIndex + 1}/${totalChunks} uploaded (${progress}%)`
        );
        onProgress?.(progress);
        return result;
      });
    });

    await Promise.all(uploadPromises);
  }

  console.log(`🔗 Finalizing upload...`);
  // اختتام آپلود و ترکیب تکه‌ها
  const result = await finalizePdfUpload(
    fileUploadUrl,
    fileId,
    totalChunks,
    file.name,
    file.size
  );

  onProgress?.(100);
  console.log("✅ PDF upload completed successfully:", result);
  return result;
}

/**
 * حذف فایل PDF از سرور
 * (اختیاری - برای استفاده آینده)
 */
export async function deleteBookPdf(fileUrl: string): Promise<void> {
  // این تابع می‌تواند بعداً برای حذف فایل‌های قدیمی استفاده شود
  // فعلاً فقط به صورت placeholder تعریف شده است
}
