"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { VideoUploader } from "@/components/Video/videoUploader";
import { useVideos, useDeleteVideo } from "@/hooks/useVideos";
import type { Video } from "@prisma/client";

const VideosPage = () => {
  const [page, setPage] = useState(1);
  const { data: videosData, isLoading } = useVideos({ page, limit: 10 });
  const deleteMutation = useDeleteVideo();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      UPLOADING: { label: "در حال آپلود", color: "bg-blue-100 text-blue-800" },
      UPLOADED: { label: "آپلود شده", color: "bg-yellow-100 text-yellow-800" },
      PROCESSING: {
        label: "در حال پردازش",
        color: "bg-orange-100 text-orange-800",
      },
      READY: { label: "آماده", color: "bg-green-100 text-green-800" },
      FAILED: { label: "خطا", color: "bg-red-100 text-red-800" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig["UPLOADING"];
    return (
      <span className={`rounded px-2 py-1 text-sm ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleDelete = (videoId: string) => {
    if (confirm("آیا از حذف این ویدیو اطمینان دارید؟")) {
      deleteMutation.mutate(videoId);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    if (bytes < 1024 * 1024 * 1024)
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="مدیریت ویدیوها" />

      <div className="flex flex-col gap-10">
        {/* آپلود ویدیوی جدید */}
        <VideoUploader
          onUploadComplete={(video: Video) => {
            alert(`ویدیو "${video.title}" با موفقیت آپلود شد!`);
          }}
        />

        {/* لیست ویدیوها */}
        <div className="rounded-lg bg-white shadow-md dark:bg-gray-dark">
          <div className="border-b border-stroke px-4 py-4 dark:border-stroke-dark">
            <h3 className="text-xl font-semibold text-dark dark:text-white">
              لیست ویدیوها
            </h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stroke bg-gray-2 dark:border-stroke-dark dark:bg-gray-dark">
                      <th className="p-4 text-right text-sm font-medium text-dark dark:text-white">
                        عنوان
                      </th>
                      <th className="p-4 text-right text-sm font-medium text-dark dark:text-white">
                        وضعیت
                      </th>
                      <th className="p-4 text-right text-sm font-medium text-dark dark:text-white">
                        حجم فایل
                      </th>
                      <th className="p-4 text-right text-sm font-medium text-dark dark:text-white">
                        فرمت
                      </th>
                      <th className="p-4 text-right text-sm font-medium text-dark dark:text-white">
                        تاریخ ایجاد
                      </th>
                      <th className="p-4 text-right text-sm font-medium text-dark dark:text-white">
                        عملیات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {videosData?.items && videosData.items.length > 0 ? (
                      videosData.items.map((video) => (
                        <tr
                          key={video.id}
                          className="border-b border-stroke dark:border-stroke-dark"
                        >
                          <td className="p-4 text-dark dark:text-white">
                            {video.title}
                            {video.description && (
                              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {video.description.substring(0, 50)}
                                {video.description.length > 50 ? "..." : ""}
                              </p>
                            )}
                          </td>
                          <td className="p-4">
                            {getStatusBadge(video.processingStatus)}
                          </td>
                          <td className="p-4 text-dark dark:text-white">
                            {formatFileSize(video.fileSize)}
                          </td>
                          <td className="p-4 text-dark dark:text-white">
                            {video.fileFormat.toUpperCase()}
                          </td>
                          <td className="p-4 text-dark dark:text-white">
                            {new Date(video.createdAt).toLocaleDateString(
                              "fa-IR",
                            )}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleDelete(video.videoId)}
                              disabled={deleteMutation.isPending}
                              className="text-red-600 transition hover:text-red-800 disabled:opacity-50"
                            >
                              حذف
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-8 text-center text-gray-500 dark:text-gray-400"
                        >
                          هیچ ویدیویی یافت نشد. ویدیوی جدیدی آپلود کنید.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {videosData?.items &&
                videosData.items.length > 0 &&
                videosData.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-stroke px-4 py-4 dark:border-stroke-dark">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      صفحه {videosData.currentPage} از {videosData.totalPages} (
                      {videosData.total} ویدیو)
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-dark dark:text-white dark:hover:bg-gray-700"
                      >
                        قبلی
                      </button>
                      <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= (videosData?.totalPages || 1)}
                        className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-dark dark:text-white dark:hover:bg-gray-700"
                      >
                        بعدی
                      </button>
                    </div>
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default VideosPage;
