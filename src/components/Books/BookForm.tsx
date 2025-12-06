"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateBook,
  useUpdateBook,
  useBook,
} from "@/hooks/api/use-books";
import { toast } from "sonner";
import type { CreateBookRequest } from "@/types/api";
import axios from "axios";
import Image from "next/image";

interface BookFormProps {
  bookId?: string;
  isEdit?: boolean;
}

const BookForm: React.FC<BookFormProps> = ({ bookId, isEdit = false }) => {
  const router = useRouter();
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const { data: bookData } = useBook(bookId || "");

  const [formData, setFormData] = useState<CreateBookRequest>({
    title: "",
    slug: "",
    author: "",
    description: "",
    cover: "",
    publisher: "",
    year: new Date().getFullYear(),
    pages: null,
    isbn: "",
    language: "فارسی",
    category: "",
    formats: [],
    status: [],
    tags: [],
    readingTime: "",
    isFeatured: false,
    price: null,
    fileUrl: "",
    audioUrl: "",
    tagIds: [],
  });

  // State to track upload progress (0-100)
  const [uploadProgress, setUploadProgress] = useState<{
    cover: number;
    fileUrl: number;
    audioUrl: number;
  }>({
    cover: 0,
    fileUrl: 0,
    audioUrl: 0,
  });

  useEffect(() => {
    if (isEdit && bookData) {
      const book = bookData.data;
      setFormData({
        title: book.title,
        slug: book.slug,
        author: book.author,
        description: book.description,
        cover: book.cover || "",
        publisher: book.publisher || "",
        year: book.year,
        pages: book.pages || null,
        isbn: book.isbn || "",
        language: book.language,
        category: book.category,
        formats: book.formats || [],
        status: book.status || [],
        tags: book.tags || [],
        readingTime: book.readingTime || "",
        isFeatured: book.isFeatured,
        price: book.price || null,
        fileUrl: book.fileUrl || "",
        audioUrl: book.audioUrl || "",
        tagIds: book.tagIds || [],
      });
    }
  }, [isEdit, bookData]);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "pdf" | "audio",
    fieldName: "cover" | "fileUrl" | "audioUrl"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset progress
    setUploadProgress((prev) => ({ ...prev, [fieldName]: 1 })); // Start at 1% for visual feedback

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("type", type);

    try {
      const uploadUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://pishrosarmaye.com";

      const response = await axios.post(
        `${uploadUrl}/api/admin/books/upload`,
        formDataUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress((prev) => ({
                ...prev,
                [fieldName]: percentCompleted,
              }));
            }
          },
        }
      );

      if (response.data.status === "success") {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: response.data.data.url,
        }));
        toast.success("فایل با موفقیت آپلود شد");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("خطا در آپلود فایل");
      setUploadProgress((prev) => ({ ...prev, [fieldName]: 0 })); // Reset on error
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && bookId) {
        await updateBook.mutateAsync({ id: bookId, data: formData });
        toast.success("کتاب با موفقیت به‌روزرسانی شد");
      } else {
        await createBook.mutateAsync(formData);
        toast.success("کتاب با موفقیت ایجاد شد");
      }
      router.push("/books");
    } catch (error: any) {
      toast.error(error?.message || "خطا در ذخیره کتاب");
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleArrayAdd = (
    field: "formats" | "status" | "tags",
    value: string,
  ) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
    }
  };

  const handleArrayRemove = (
    field: "formats" | "status" | "tags",
    index: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Helper component for Upload UI
  const UploadField = ({
    label,
    fieldName,
    type,
    accept,
    progress,
    value,
  }: {
    label: string;
    fieldName: "cover" | "fileUrl" | "audioUrl";
    type: "image" | "pdf" | "audio";
    accept: string;
    progress: number;
    value: string;
  }) => (
    <div className="w-full">
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {label}
      </label>
      <div className="flex flex-col gap-3">
        {/* Input for manual URL or showing uploaded URL */}
        <input
          type="text"
          name={fieldName}
          value={value || ""}
          onChange={handleChange}
          placeholder="آدرس URL یا آپلود فایل"
          className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        />

        {/* File Input */}
        <div className="relative">
          <input
            type="file"
            accept={accept}
            onChange={(e) => handleFileUpload(e, type, fieldName)}
            className="w-full cursor-pointer rounded border border-stroke bg-white p-2 text-sm file:mr-4 file:cursor-pointer file:rounded file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-opacity-90 dark:border-dark-3 dark:bg-dark-2 dark:file:bg-primary dark:file:text-white"
            disabled={progress > 0 && progress < 100}
          />
        </div>

        {/* Progress Bar */}
        {progress > 0 && progress < 100 && (
          <div className="relative h-4 w-full rounded-full bg-stroke dark:bg-dark-3">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white">
              {progress}%
            </span>
          </div>
        )}

        {/* Previews */}
        {value && (
          <div className="mt-2 rounded border border-stroke p-2 dark:border-dark-3">
            {type === "image" && (
              <div className="relative aspect-[3/4] w-24 overflow-hidden rounded">
                <Image
                  src={value}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {type === "audio" && (
              <audio controls className="w-full">
                <source src={value} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
            {type === "pdf" && (
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                مشاهده فایل آپلود شده
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش کتاب" : "افزودن کتاب جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              Slug <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              نویسنده <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              ناشر
            </label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            توضیحات <span className="text-red">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              دسته‌بندی <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              سال انتشار <span className="text-red">*</span>
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              تعداد صفحات
            </label>
            <input
              type="number"
              name="pages"
              value={formData.pages || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              ISBN
            </label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              زبان
            </label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              زمان مطالعه
            </label>
            <input
              type="text"
              name="readingTime"
              value={formData.readingTime || ""}
              onChange={handleChange}
              placeholder="مثلاً: 5 ساعت"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <UploadField
              label="تصویر جلد (Image)"
              fieldName="cover"
              type="image"
              accept="image/*"
              progress={uploadProgress.cover}
              value={formData.cover || ""}
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              قیمت (تومان)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <UploadField
              label="فایل کتاب (PDF)"
              fieldName="fileUrl"
              type="pdf"
              accept="application/pdf"
              progress={uploadProgress.fileUrl}
              value={formData.fileUrl || ""}
            />
          </div>

          <div className="w-full sm:w-1/2">
            <UploadField
              label="فایل صوتی (Audio)"
              fieldName="audioUrl"
              type="audio"
              accept="audio/*"
              progress={uploadProgress.audioUrl}
              value={formData.audioUrl || ""}
            />
          </div>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            فرمت‌ها
          </label>

          <div className="mb-3 flex flex-wrap gap-2">
            {formData.formats.map((format, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded bg-primary bg-opacity-10 px-3 py-1.5"
              >
                <span className="text-body-sm text-dark dark:text-white">
                  {format}
                </span>
                <button
                  type="button"
                  onClick={() => handleArrayRemove("formats", index)}
                  className="text-red hover:text-opacity-80"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              id="format-input"
              placeholder="مثلاً: PDF, EPUB"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  handleArrayAdd("formats", input.value);
                  input.value = "";
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById(
                  "format-input",
                ) as HTMLInputElement;
                handleArrayAdd("formats", input.value);
                input.value = "";
              }}
              className="rounded bg-primary px-6 py-3 text-white hover:bg-opacity-90"
            >
              افزودن
            </button>
          </div>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            وضعیت‌ها
          </label>

          <div className="mb-3 flex flex-wrap gap-2">
            {formData.status.map((stat, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded bg-primary bg-opacity-10 px-3 py-1.5"
              >
                <span className="text-body-sm text-dark dark:text-white">
                  {stat}
                </span>
                <button
                  type="button"
                  onClick={() => handleArrayRemove("status", index)}
                  className="text-red hover:text-opacity-80"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              id="status-input"
              placeholder="مثلاً: جدید، پرفروش"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  handleArrayAdd("status", input.value);
                  input.value = "";
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById(
                  "status-input",
                ) as HTMLInputElement;
                handleArrayAdd("status", input.value);
                input.value = "";
              }}
              className="rounded bg-primary px-6 py-3 text-white hover:bg-opacity-90"
            >
              افزودن
            </button>
          </div>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            تگ‌ها
          </label>

          <div className="mb-3 flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded bg-primary bg-opacity-10 px-3 py-1.5"
              >
                <span className="text-body-sm text-dark dark:text-white">
                  {tag}
                </span>
                <button
                  type="button"
                  onClick={() => handleArrayRemove("tags", index)}
                  className="text-red hover:text-opacity-80"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              id="tag-input"
              placeholder="یک تگ وارد کنید"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  handleArrayAdd("tags", input.value);
                  input.value = "";
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById(
                  "tag-input",
                ) as HTMLInputElement;
                handleArrayAdd("tags", input.value);
                input.value = "";
              }}
              className="rounded bg-primary px-6 py-3 text-white hover:bg-opacity-90"
            >
              افزودن
            </button>
          </div>
        </div>

        <div className="mb-5.5 flex gap-5">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="rounded border-stroke"
            />
            <span className="text-body-sm font-medium text-dark dark:text-white">
              ویژه
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/books")}
            className="rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={createBook.isPending || updateBook.isPending}
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createBook.isPending || updateBook.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
