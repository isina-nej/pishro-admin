"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateNews,
  useUpdateNews,
  useNewsArticle,
} from "@/hooks/api/use-news";
import { useCategories } from "@/hooks/api/use-categories";
import type { CreateNewsRequest } from "@/types/api";

interface NewsFormProps {
  newsId?: string;
  isEdit?: boolean;
}

const NewsForm: React.FC<NewsFormProps> = ({ newsId, isEdit = false }) => {
  const router = useRouter();
  const createNews = useCreateNews();
  const updateNews = useUpdateNews();
  const { data: newsData } = useNewsArticle(newsId || "");
  const { data: categoriesData } = useCategories({ limit: 100 });

  const [formData, setFormData] = useState<CreateNewsRequest>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    author: "",
    category: "",
    tags: [],
    published: false,
    publishedAt: null,
    categoryId: undefined,
    tagIds: [],
    featured: false,
    readingTime: null,
    aboutPageId: null,
  });

  useEffect(() => {
    if (isEdit && newsData) {
      const news = newsData;
      setFormData({
        title: news.title,
        slug: news.slug,
        excerpt: news.excerpt,
        content: news.content,
        coverImage: news.coverImage || "",
        author: news.author || "",
        category: news.category,
        tags: news.tags || [],
        published: news.published,
        publishedAt: news.publishedAt || null,
        categoryId: news.categoryId || undefined,
        tagIds: news.tagIds || [],
        featured: news.featured,
        readingTime: news.readingTime || null,
        aboutPageId: news.aboutPageId || null,
      });
    }
  }, [isEdit, newsData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && newsId) {
        await updateNews.mutateAsync({ id: newsId, data: formData });
        alert("خبر با موفقیت به‌روزرسانی شد");
      } else {
        await createNews.mutateAsync(formData);
        alert("خبر با موفقیت ایجاد شد");
      }
      router.push("/news");
    } catch (error: any) {
      alert(error?.message || "خطا در ذخیره خبر");
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

  const handleTagsAdd = (value: string) => {
    if (value.trim() && !formData.tags.includes(value.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, value.trim()],
      }));
    }
  };

  const handleTagsRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش خبر" : "افزودن خبر جدید"}
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

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            خلاصه <span className="text-red">*</span>
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            rows={3}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            محتوا <span className="text-red">*</span>
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={10}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              دسته‌بندی <span className="text-red">*</span>
            </label>
            <select
              name="categoryId"
              value={formData.categoryId || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="">انتخاب کنید...</option>
              {categoriesData?.items?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              دسته (متنی) <span className="text-red">*</span>
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
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              نویسنده
            </label>
            <input
              type="text"
              name="author"
              value={formData.author || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              زمان مطالعه (دقیقه)
            </label>
            <input
              type="number"
              name="readingTime"
              value={formData.readingTime || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            تصویر کاور (URL)
          </label>
          <input
            type="text"
            name="coverImage"
            value={formData.coverImage || ""}
            onChange={handleChange}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            تاریخ انتشار
          </label>
          <input
            type="datetime-local"
            name="publishedAt"
            value={
              formData.publishedAt
                ? new Date(formData.publishedAt).toISOString().slice(0, 16)
                : ""
            }
            onChange={handleChange}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
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
                  onClick={() => handleTagsRemove(index)}
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
                  handleTagsAdd(input.value);
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
                handleTagsAdd(input.value);
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
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="rounded border-stroke"
            />
            <span className="text-body-sm font-medium text-dark dark:text-white">
              منتشر شده
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
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
            onClick={() => router.push("/news")}
            className="rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={createNews.isPending || updateNews.isPending}
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createNews.isPending || updateNews.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;
