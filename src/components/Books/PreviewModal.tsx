"use client";

import React from "react";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: "image" | "pdf" | "audio";
  src: string;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  type,
  src,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-white dark:bg-dark-2">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-2xl text-body hover:text-dark dark:text-body-dark dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {type === "image" && (
            <img
              src={src}
              alt={title}
              className="max-h-[70vh] w-full rounded object-contain"
              onError={(e) => {
                console.error("Image load error:", src);
                e.currentTarget.src = "/images/placeholder.jpg";
              }}
            />
          )}

          {type === "pdf" && (
            <div className="flex flex-col items-center justify-center gap-4">
              <svg
                className="h-16 w-16 text-blue"
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
              <p className="text-lg font-medium text-dark dark:text-white">
                PDF Preview
              </p>
              <p className="mb-4 text-center text-sm text-body dark:text-body-dark">
                Click below to download or open in a new window
              </p>
              <div className="flex gap-3">
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded bg-primary px-6 py-2 text-white hover:bg-opacity-90"
                >
                  Open in New Window
                </a>
                <a
                  href={src}
                  download
                  className="rounded border border-stroke bg-white px-6 py-2 text-dark hover:bg-gray-light dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                >
                  Download
                </a>
              </div>
            </div>
          )}

          {type === "audio" && (
            <div className="flex flex-col items-center justify-center gap-6">
              <svg
                className="h-16 w-16 text-purple"
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
              <p className="text-lg font-medium text-dark dark:text-white">
                Audio Preview
              </p>
              <audio
                controls
                className="w-full max-w-md"
                src={src}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
