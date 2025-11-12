"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateBook,
  useUpdateBook,
  useBook,
} from "@/hooks/api/use-books";
import type { CreateBookRequest } from "@/types/api";

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

  useEffect(() => {
    if (isEdit && bookData) {
      const book = bookData;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && bookId) {
        await updateBook.mutateAsync({ id: bookId, data: formData });
        alert("کتاب با موفقیت به‌روزرسانی شد");
      } else {
        await createBook.mutateAsync(formData);
        alert("کتاب با موفقیت ایجاد شد");
      }
      router.push("/books");
    } catch (error: any) {
      alert(error?.message || "خطا در ذخیره کتاب");
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
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              تصویر جلد (URL)
            </label>
            <input
              type="text"
              name="cover"
              value={formData.cover || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
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
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              لینک فایل
            </label>
            <input
              type="text"
              name="fileUrl"
              value={formData.fileUrl || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              لینک صوتی
            </label>
            <input
              type="text"
              name="audioUrl"
              value={formData.audioUrl || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
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
