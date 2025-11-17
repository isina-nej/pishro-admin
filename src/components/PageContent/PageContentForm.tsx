"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreatePageContent,
  useUpdatePageContent,
  usePageContent,
} from "@/hooks/api/use-page-content";
import { toast } from "sonner";
import { useCategories } from "@/hooks/api/use-categories";
import type { CreatePageContentRequest } from "@/types/api";

interface PageContentFormProps {
  contentId?: string;
  isEdit?: boolean;
}

const PageContentForm: React.FC<PageContentFormProps> = ({
  contentId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createPageContent = useCreatePageContent();
  const updatePageContent = useUpdatePageContent();
  const { data: contentData } = usePageContent(contentId || "");
  const { data: categoriesData } = useCategories({ limit: 100 });

  const [contentJsonString, setContentJsonString] = useState("{}");
  const [formData, setFormData] = useState<CreatePageContentRequest>({
    categoryId: "",
    type: "LANDING",
    section: null,
    title: null,
    subtitle: null,
    content: {},
    language: "FA",
    order: 0,
    published: true,
    publishAt: null,
    expireAt: null,
  });

  useEffect(() => {
    if (isEdit && contentData) {
      const content = contentData;
      setFormData({
        categoryId: content.categoryId,
        type: content.type,
        section: content.section,
        title: content.title,
        subtitle: content.subtitle,
        content: content.content,
        language: content.language,
        order: content.order,
        published: content.published,
        publishAt: content.publishAt,
        expireAt: content.expireAt,
      });
      setContentJsonString(JSON.stringify(content.content, null, 2));
    }
  }, [isEdit, contentData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Parse JSON content
      let parsedContent;
      try {
        parsedContent = JSON.parse(contentJsonString);
      } catch (error) {
        toast.error("محتوای JSON نامعتبر است");
        return;
      }

      const submitData = {
        ...formData,
        content: parsedContent,
      };

      if (isEdit && contentId) {
        await updatePageContent.mutateAsync({ id: contentId, data: submitData });
        toast.success("محتوا با موفقیت به‌روزرسانی شد");
      } else {
        await createPageContent.mutateAsync(submitData);
        toast.success("محتوا با موفقیت ایجاد شد");
      }

      router.push("/page-content");
    } catch (error: any) {
      toast.error(error?.message || "خطا در ذخیره محتوا");
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
            : value === "" ? null : value,
    }));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش محتوا" : "افزودن محتوا جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              دسته‌بندی <span className="text-red">*</span>
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
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
              نوع محتوا <span className="text-red">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="LANDING">LANDING</option>
              <option value="ABOUT">ABOUT</option>
              <option value="FEATURES">FEATURES</option>
              <option value="FAQ">FAQ</option>
              <option value="TESTIMONIAL">TESTIMONIAL</option>
              <option value="HERO">HERO</option>
              <option value="STATS">STATS</option>
            </select>
          </div>
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان
            </label>
            <input
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              زیرعنوان
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            بخش
          </label>
          <input
            type="text"
            name="section"
            value={formData.section || ""}
            onChange={handleChange}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            محتوا (JSON) <span className="text-red">*</span>
          </label>
          <textarea
            value={contentJsonString}
            onChange={(e) => setContentJsonString(e.target.value)}
            rows={10}
            required
            placeholder='{"key": "value"}'
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 font-mono text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
          <p className="mt-1 text-body-sm text-body">
            محتوا باید به فرمت JSON معتبر باشد
          </p>
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              زبان
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="FA">فارسی</option>
              <option value="EN">انگلیسی</option>
            </select>
          </div>

          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              ترتیب
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/3 flex items-end">
            <label className="flex cursor-pointer items-center gap-2 mb-3">
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
          </div>
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              تاریخ انتشار
            </label>
            <input
              type="datetime-local"
              name="publishAt"
              value={formData.publishAt ? new Date(formData.publishAt).toISOString().slice(0, 16) : ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              تاریخ انقضا
            </label>
            <input
              type="datetime-local"
              name="expireAt"
              value={formData.expireAt ? new Date(formData.expireAt).toISOString().slice(0, 16) : ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/page-content")}
            className="rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={createPageContent.isPending || updatePageContent.isPending}
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createPageContent.isPending || updatePageContent.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PageContentForm;
