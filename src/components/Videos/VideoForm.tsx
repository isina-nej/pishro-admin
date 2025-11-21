"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCompleteVideoUpload, useUpdateVideo, useVideo } from "@/hooks/api/use-videos";
import { toast } from "sonner";

interface VideoFormProps {
  videoId?: string;
  isEdit?: boolean;
}

const VideoForm: React.FC<VideoFormProps> = ({ videoId, isEdit = false }) => {
  const router = useRouter();
  const uploadVideo = useCompleteVideoUpload();
  const updateVideo = useUpdateVideo(videoId || "");
  const { data: videoData } = useVideo(videoId || "");

  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (isEdit && videoData) {
      const video = videoData.data;
      setFormData({
        title: video.title || "",
        description: video.description || "",
      });
    }
  }, [isEdit, videoData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // بررسی فرمت
      const allowedFormats = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/webm"];
      if (!allowedFormats.includes(selectedFile.type)) {
        toast.error("فرمت فایل پشتیبانی نمی‌شود. فقط mp4, mov, avi, mkv, webm مجاز است");
        return;
      }
      // بررسی حجم (5GB max)
      if (selectedFile.size > 5 * 1024 * 1024 * 1024) {
        toast.error("حجم فایل نباید بیشتر از 5GB باشد");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && videoId) {
        await updateVideo.mutateAsync({
          title: formData.title,
          description: formData.description,
        });
        toast.success("ویدیو با موفقیت به‌روزرسانی شد");
        router.push("/videos");
      } else {
        if (!file) {
          toast.error("لطفا یک ویدیو انتخاب کنید");
          return;
        }

        await uploadVideo.mutateAsync({
          file,
          title: formData.title,
          description: formData.description,
          onProgress: (stage, progress) => {
            setUploadProgress(progress);
            switch (stage) {
              case "requesting_url":
                setUploadStage("درخواست URL آپلود...");
                break;
              case "uploading":
                setUploadStage(`در حال آپلود... ${progress}%`);
                break;
              case "saving":
                setUploadStage("در حال ذخیره در دیتابیس...");
                break;
              case "completed":
                setUploadStage("آپلود کامل شد!");
                break;
            }
          },
        });

        toast.success("ویدیو با موفقیت آپلود شد و در صف پردازش قرار گرفت");
        router.push("/videos");
      }
    } catch (error: any) {
      toast.error(error?.message || "خطا در ذخیره ویدیو");
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isUploading = uploadVideo.isPending || updateVideo.isPending;

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش ویدیو" : "آپلود ویدیو جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        {/* File Upload (only for create) */}
        {!isEdit && (
          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              فایل ویدیو <span className="text-red">*</span>
            </label>
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm"
              onChange={handleFileChange}
              required
              disabled={isUploading}
              className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke bg-transparent file:mr-4 file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary focus:border-primary active:border-primary disabled:cursor-default disabled:opacity-50 dark:border-dark-3 dark:bg-dark-2"
            />
            <p className="mt-2 text-sm text-gray-500">
              فرمت‌های مجاز: MP4, MOV, AVI, MKV, WEBM | حداکثر حجم: 5GB
            </p>
            {file && (
              <p className="mt-2 text-sm text-success">
                فایل انتخاب شده: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && uploadStage && (
          <div className="mb-5.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-dark dark:text-white">{uploadStage}</span>
              <span className="text-sm font-medium text-primary">{uploadProgress}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2.5 rounded-full bg-primary transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Video Info (only in edit mode) */}
        {isEdit && videoData && (
          <div className="mb-5.5 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <p className="mb-2 text-sm">
              <span className="font-medium">وضعیت پردازش:</span>{" "}
              <span className={`inline-flex rounded px-2 py-0.5 text-xs ${
                String(videoData.data.processingStatus) === "COMPLETED"
                  ? "bg-success/10 text-success"
                  : String(videoData.data.processingStatus) === "FAILED"
                    ? "bg-danger/10 text-danger"
                    : "bg-warning/10 text-warning"
              }`}>
                {String(videoData.data.processingStatus) === "COMPLETED" ? "تکمیل شده" :
                 String(videoData.data.processingStatus) === "PROCESSING" ? "در حال پردازش" :
                 String(videoData.data.processingStatus) === "FAILED" ? "خطا" : String(videoData.data.processingStatus)}
              </span>
            </p>
            {videoData.data.duration && typeof videoData.data.duration === 'number' && (
              <p className="text-sm">
                <span className="font-medium">مدت زمان:</span> {Math.floor(videoData.data.duration / 60)}:{(videoData.data.duration % 60).toString().padStart(2, '0')}
              </p>
            )}
          </div>
        )}

        {/* Title */}
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            عنوان <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={isUploading}
            placeholder="عنوان ویدیو"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default disabled:opacity-50 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        {/* Description */}
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            توضیحات
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={isUploading}
            rows={5}
            placeholder="توضیحات ویدیو"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default disabled:opacity-50 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isUploading}
            className="inline-flex items-center justify-center rounded bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {isUploading
              ? "در حال پردازش..."
              : isEdit
                ? "به‌روزرسانی"
                : "آپلود"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/videos")}
            disabled={isUploading}
            className="inline-flex items-center justify-center rounded border border-stroke px-6 py-3 font-medium text-dark hover:shadow-1 disabled:opacity-50 dark:border-dark-3 dark:text-white"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoForm;
