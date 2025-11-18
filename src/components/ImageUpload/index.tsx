"use client";

import React, { useState, useRef, useEffect } from "react";
import { useUploadImage } from "@/hooks/api/use-images";
import { ImageCategory } from "@/types/api";
import { toast } from "sonner";
import Image from "next/image";

interface ImageUploadProps {
  label: string;
  name: string;
  value?: string;
  onChange: (url: string) => void;
  category: ImageCategory;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  showPreview?: boolean;
  previewWidth?: number;
  previewHeight?: number;
  alt?: string;
  title?: string;
  description?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  name,
  value = "",
  onChange,
  category,
  required = false,
  disabled = false,
  accept = "image/png,image/jpg,image/jpeg,image/gif,image/webp,image/svg+xml",
  maxSize = 10, // 10MB default
  showPreview = true,
  previewWidth = 200,
  previewHeight = 200,
  alt = "",
  title = "",
  description = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(value);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const uploadImage = useUploadImage();

  useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = accept.split(",").map((t) => t.trim());
    const fileType = file.type;
    if (!validTypes.includes(fileType)) {
      toast.error(`فرمت فایل معتبر نیست. فرمت‌های مجاز: ${accept}`);
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      toast.error(`حجم فایل نباید بیشتر از ${maxSize}MB باشد`);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload image
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

      const response = await uploadImage.mutateAsync({
        file,
        category,
        title: title || file.name,
        description,
        alt: alt || file.name,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.data.data.url) {
        onChange(response.data.data.url);
        toast.success("تصویر با موفقیت آپلود شد");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error?.message || "خطا در آپلود تصویر");
      setPreview(value); // Reset to original value
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {label} {required && <span className="text-red">*</span>}
      </label>

      <div className="space-y-3">
        {/* Preview */}
        {showPreview && preview && (
          <div className="relative inline-block">
            <div
              className="relative overflow-hidden rounded-[7px] border-[1.5px] border-stroke dark:border-dark-3"
              style={{
                width: previewWidth,
                height: previewHeight,
              }}
            >
              <Image
                src={preview.startsWith("/") ? preview : preview}
                alt={alt || "Preview"}
                fill
                className="object-cover"
                onError={() => {
                  // Fallback for broken images
                  setPreview("");
                }}
              />
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red text-white hover:bg-red/90"
                title="حذف تصویر"
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="w-full">
            <div className="mb-2 flex items-center justify-between text-body-sm">
              <span className="text-dark dark:text-white">در حال آپلود...</span>
              <span className="text-primary">{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            name={name}
            accept={accept}
            onChange={handleFileSelect}
            disabled={disabled || uploading}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleClick}
            disabled={disabled || uploading}
            className="inline-flex items-center justify-center rounded-[7px] border border-primary px-5 py-2.5 text-center text-body-sm font-medium text-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:text-white"
          >
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {preview ? "تغییر تصویر" : "انتخاب تصویر"}
          </button>
          <p className="mt-2 text-body-xs text-gray-5">
            فرمت‌های مجاز: JPG, PNG, GIF, WEBP, SVG - حداکثر {maxSize}MB
          </p>
        </div>

        {/* Hidden input to store URL */}
        <input type="hidden" name={`${name}_url`} value={value} />
      </div>
    </div>
  );
};

export default ImageUpload;
