"use client";

import React, { useRef, useState, useEffect } from "react";
import useUploadBookFiles from "@/hooks/api/use-books-upload";
import { toast } from "sonner";

interface FileUploadProps {
  label: string;
  name: string;
  field: "book" | "audio" | "cover";
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  showPreview?: boolean; // for audio and cover
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  name,
  field,
  value = "",
  onChange,
  accept = "*/*",
  maxSize = 100,
  showPreview = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const uploadMutation = useUploadBookFiles();

  useEffect(() => {
    // derive filename from url
    if (value) {
      try {
        const parts = value.split("/");
        setFileName(parts[parts.length - 1]);
      } catch (e) {
        setFileName("");
      }
    } else {
      setFileName("");
    }
  }, [value]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      toast.error(`حجم فایل نباید بیشتر از ${maxSize}MB باشد`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await uploadMutation.mutateAsync({ field, file });
      clearInterval(progressInterval);
      setUploadProgress(100);
      // response.data.uploads is an array; find our field
      const uploads = response.data.uploads || [];
      const expectedField = field === "book" ? "fileUrl" : field === "audio" ? "audioUrl" : "cover";
      const upload = uploads.find((u: any) => u.field === expectedField);
      const url = upload ? upload.url : uploads[0]?.url;
      if (url) {
        onChange(url);
        toast.success("فایل با موفقیت آپلود شد");
      } else {
        toast.error("آدرس برگشتی برای فایل یافت نشد");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error?.message || "خطا در آپلود فایل");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onChange("");
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {label}
      </label>
      <div className="space-y-2">
        {showPreview && field === "audio" && value && (
          <audio controls src={value} className="w-full" />
        )}

        {fileName && (
          <div className="mb-2 flex items-center justify-between rounded bg-gray-1 px-3 py-2">
            <span className="text-sm text-dark">{fileName}</span>
            <button onClick={handleRemove} className="text-red">حذف</button>
          </div>
        )}

        {uploading && (
          <div>
            <div className="mb-2 flex items-center justify-between text-body-sm">
              <span className="text-dark">در حال آپلود...</span>
              <span className="text-primary">{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}

        <div className="flex gap-2 items-center">
          <input ref={fileInputRef} type="file" name={name} accept={accept} onChange={handleFileSelect} className="hidden" />
          <button type="button" onClick={handleClick} className="rounded border border-primary px-5 py-2.5 text-primary hover:bg-primary hover:text-white">
            انتخاب فایل
          </button>
          <input type="text" name={name} value={value} onChange={(e) => onChange(e.target.value)} placeholder="لینک فایل (اختیاری)" className="w-full rounded-[7px] border-stroke px-3 py-2" />
        </div>
        <p className="mt-2 text-body-xs text-gray-5">فرمت‌های مجاز: {accept} - حداکثر {maxSize}MB</p>
      </div>
    </div>
  );
};

export default FileUpload;
