"use client";

import React from "react";

interface FilePreviewProps {
  fileUrl: string;
  fileName: string;
  fileType: "image" | "pdf" | "audio";
  onRemove: () => void;
  isUploading?: boolean;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  fileUrl,
  fileName,
  fileType,
  onRemove,
  isUploading = false,
}) => {
  const getPreviewContent = () => {
    switch (fileType) {
      case "image":
        return (
          <img
            src={fileUrl}
            alt={fileName}
            className="max-h-40 max-w-32 rounded object-cover"
          />
        );
      case "pdf":
        return (
          <div className="flex flex-col items-center gap-2">
            <svg
              className="h-8 w-8 text-blue"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm font-medium text-dark dark:text-white">
              فایل PDF آپلود شد
            </p>
          </div>
        );
      case "audio":
        return (
          <div className="flex flex-col items-center gap-2">
            <svg
              className="h-8 w-8 text-purple"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
            <p className="text-sm font-medium text-dark dark:text-white">
              فایل صوتی آپلود شد
            </p>
            {fileUrl && (
              <audio
                controls
                className="mt-2 w-full"
                src={fileUrl}
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const getBackgroundColor = () => {
    switch (fileType) {
      case "image":
        return "bg-green-light dark:bg-green-dark/20";
      case "pdf":
        return "bg-blue-light dark:bg-blue-dark/20";
      case "audio":
        return "bg-purple-light dark:bg-purple-dark/20";
      default:
        return "bg-gray-light dark:bg-dark-3";
    }
  };

  return (
    <div className="rounded border border-dashed border-stroke p-4 dark:border-dark-3">
      <div className={`mb-3 flex items-center justify-center rounded p-4 ${getBackgroundColor()}`}>
        {getPreviewContent()}
      </div>
      <div className="flex items-center justify-between rounded bg-green-light p-3">
        <div>
          <p className="text-sm font-medium text-dark dark:text-white">
            {fileName}
          </p>
          <p className="text-xs text-body dark:text-body-dark">
            {fileType === "image" && "تصویر جلد"}
            {fileType === "pdf" && "فایل PDF کتاب"}
            {fileType === "audio" && "فایل صوتی کتاب"}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          disabled={isUploading}
          className="text-red hover:text-opacity-80 disabled:opacity-50"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default FilePreview;
