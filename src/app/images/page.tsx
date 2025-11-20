"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import {
  useImages,
  useDeleteImage,
  useUploadImage,
  useImageStats,
} from "@/hooks/api/use-images";
import type { ImageCategory } from "@prisma/client";
import { toast } from "sonner";

const ImagesPage = () => {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const { data: imagesData, isLoading } = useImages({
    page,
    limit: 20,
    category: selectedCategory || undefined,
    search: searchQuery || undefined,
  });

  const { data: stats } = useImageStats();
  const deleteMutation = useDeleteImage();
  const uploadMutation = useUploadImage();

  const categories: ImageCategory[] = [
    "PROFILE",
    "COURSE",
    "BOOK",
    "NEWS",
    "RESUME",
    "CERTIFICATE",
    "TEAM",
    "LANDING",
    "OTHER",
  ];

  const categoryLabels: Record<ImageCategory, string> = {
    PROFILE: "پروفایل",
    COURSE: "دوره‌ها",
    BOOK: "کتاب‌ها",
    NEWS: "اخبار",
    RESUME: "رزومه",
    CERTIFICATE: "گواهینامه",
    TEAM: "تیم",
    LANDING: "لندینگ",
    OTHER: "سایر",
  };

  const handleDelete = (id: string) => {
    if (confirm("آیا از حذف این تصویر اطمینان دارید؟")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success("تصویر با موفقیت حذف شد");
        },
        onError: (error: any) => {
          toast.error(error?.message || "خطا در حذف تصویر");
        },
      });
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    const category = formData.get("category") as ImageCategory;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const alt = formData.get("alt") as string;

    if (!file) {
      toast.error("لطفا یک فایل انتخاب کنید");
      return;
    }

    uploadMutation.mutate(
      {
        file,
        category: category || "OTHER",
        title,
        description,
        alt,
      },
      {
        onSuccess: () => {
          toast.success("تصویر با موفقیت آپلود شد");
          setIsUploadModalOpen(false);
        },
        onError: (error: any) => {
          toast.error(error?.message || "خطا در آپلود تصویر");
        },
      }
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="مدیریت تصاویر" />

      <div className="flex flex-col gap-6">
        {/* آمار تصاویر */}
        {stats && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-dark">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                تعداد کل تصاویر
              </h3>
              <p className="mt-2 text-3xl font-bold text-dark dark:text-white">
                {stats.total}
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-dark">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                حجم کل
              </h3>
              <p className="mt-2 text-3xl font-bold text-dark dark:text-white">
                {formatFileSize(stats.totalSize)}
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-dark">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                دسته‌بندی‌ها
              </h3>
              <p className="mt-2 text-3xl font-bold text-dark dark:text-white">
                {stats.byCategory?.length || 0}
              </p>
            </div>
          </div>
        )}

        {/* فیلتر و جستجو */}
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-dark">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-4">
              <input
                type="text"
                placeholder="جستجوی تصویر..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 rounded-lg border border-stroke px-4 py-2 focus:border-primary focus:outline-none dark:border-stroke-dark dark:bg-gray-dark dark:text-white"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ImageCategory | "")}
                className="rounded-lg border border-stroke px-4 py-2 focus:border-primary focus:outline-none dark:border-stroke-dark dark:bg-gray-dark dark:text-white"
              >
                <option value="">همه دسته‌بندی‌ها</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {categoryLabels[cat]}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="rounded-lg bg-primary px-6 py-2 font-medium text-white transition hover:bg-primary/90"
            >
              آپلود تصویر جدید
            </button>
          </div>
        </div>

        {/* لیست تصاویر */}
        <div className="rounded-lg bg-white shadow-md dark:bg-gray-dark">
          <div className="border-b border-stroke px-6 py-4 dark:border-stroke-dark">
            <h3 className="text-xl font-semibold text-dark dark:text-white">
              لیست تصاویر
            </h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {imagesData?.data?.items && imagesData.data.items.length > 0 ? (
                  imagesData.data.items.map((image: any) => (
                    <div
                      key={image.id}
                      className="group relative overflow-hidden rounded-lg border border-stroke dark:border-stroke-dark"
                    >
                      <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={image.filePath}
                          alt={image.alt || image.title}
                          className="h-full w-full object-cover transition group-hover:scale-110"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="truncate font-medium text-dark dark:text-white">
                          {image.title || "بدون عنوان"}
                        </h4>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {categoryLabels[image.category as ImageCategory]}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {formatFileSize(image.fileSize)}
                        </p>
                      </div>
                      <div className="absolute left-2 top-2 flex gap-2 opacity-0 transition group-hover:opacity-100">
                        <button
                          onClick={() => handleDelete(image.id)}
                          disabled={deleteMutation.isPending}
                          className="rounded bg-red-600 p-2 text-white transition hover:bg-red-700 disabled:opacity-50"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center text-gray-500 dark:text-gray-400">
                    هیچ تصویری یافت نشد.
                  </div>
                )}
              </div>

              {/* Pagination */}
              {imagesData?.data?.items &&
                imagesData.data.items.length > 0 &&
                imagesData.data.pagination.total > imagesData.data.pagination.limit && (
                  <div className="flex items-center justify-between border-t border-stroke px-6 py-4 dark:border-stroke-dark">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      صفحه {imagesData.data.pagination.page} از{" "}
                      {Math.ceil(
                        imagesData.data.pagination.total / imagesData.data.pagination.limit
                      )}{" "}
                      ({imagesData.data.pagination.total} تصویر)
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
                        disabled={
                          page >=
                          Math.ceil(
                            imagesData.data.pagination.total /
                              imagesData.data.pagination.limit
                          )
                        }
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

      {/* مودال آپلود */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-dark">
            <h3 className="mb-4 text-xl font-semibold text-dark dark:text-white">
              آپلود تصویر جدید
            </h3>
            <form onSubmit={handleUpload} className="flex flex-col gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  فایل تصویر *
                </label>
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  required
                  className="w-full rounded-lg border border-stroke px-4 py-2 focus:border-primary focus:outline-none dark:border-stroke-dark dark:bg-gray-dark dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  دسته‌بندی *
                </label>
                <select
                  name="category"
                  required
                  className="w-full rounded-lg border border-stroke px-4 py-2 focus:border-primary focus:outline-none dark:border-stroke-dark dark:bg-gray-dark dark:text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {categoryLabels[cat]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  عنوان
                </label>
                <input
                  type="text"
                  name="title"
                  className="w-full rounded-lg border border-stroke px-4 py-2 focus:border-primary focus:outline-none dark:border-stroke-dark dark:bg-gray-dark dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  توضیحات
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full rounded-lg border border-stroke px-4 py-2 focus:border-primary focus:outline-none dark:border-stroke-dark dark:bg-gray-dark dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  متن جایگزین (Alt)
                </label>
                <input
                  type="text"
                  name="alt"
                  className="w-full rounded-lg border border-stroke px-4 py-2 focus:border-primary focus:outline-none dark:border-stroke-dark dark:bg-gray-dark dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={uploadMutation.isPending}
                  className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:bg-primary/90 disabled:opacity-50"
                >
                  {uploadMutation.isPending ? "در حال آپلود..." : "آپلود"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 rounded-lg border border-stroke px-4 py-2 font-medium text-dark transition hover:bg-gray-100 dark:border-stroke-dark dark:text-white dark:hover:bg-gray-800"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default ImagesPage;
