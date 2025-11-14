"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateResumeItem,
  useUpdateResumeItem,
  useResumeItem,
  useAboutPages,
} from "@/hooks/api/use-about-page";
import type { CreateResumeItemRequest } from "@/types/api";

interface ResumeItemFormProps {
  itemId?: string;
  isEdit?: boolean;
}

const ResumeItemForm: React.FC<ResumeItemFormProps> = ({
  itemId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createItem = useCreateResumeItem();
  const updateItem = useUpdateResumeItem();
  const { data: itemData } = useResumeItem(itemId || "");
  const { data: aboutPagesData } = useAboutPages();

  const [formData, setFormData] = useState<CreateResumeItemRequest>({
    aboutPageId: "",
    title: "",
    description: "",
    icon: "",
    color: "",
    bgColor: "",
    order: 0,
    published: true,
  });

  useEffect(() => {
    if (isEdit && itemData) {
      const item = itemData;
      setFormData({
        aboutPageId: item.aboutPageId,
        title: item.title,
        description: item.description,
        icon: item.icon || "",
        color: item.color || "",
        bgColor: item.bgColor || "",
        order: item.order,
        published: item.published,
      });
    } else if (!isEdit && aboutPagesData?.items?.[0]?.id) {
      // Auto-select first about page for new items
      setFormData((prev) => ({
        ...prev,
        aboutPageId: aboutPagesData.items[0].id,
      }));
    }
  }, [isEdit, itemData, aboutPagesData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && itemId) {
        await updateItem.mutateAsync({ id: itemId, data: formData });
        alert("آیتم با موفقیت به‌روزرسانی شد");
      } else {
        await createItem.mutateAsync(formData);
        alert("آیتم با موفقیت ایجاد شد");
      }
      router.push("/resume-items");
    } catch (error: any) {
      alert(error?.message || "خطا در ذخیره آیتم");
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
            ? parseInt(value) || 0
            : value,
    }));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش آیتم رزومه" : "افزودن آیتم رزومه جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        {/* About Page Selection */}
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            صفحه درباره ما <span className="text-red">*</span>
          </label>
          <select
            name="aboutPageId"
            value={formData.aboutPageId}
            onChange={handleChange}
            required
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            <option value="">انتخاب کنید</option>
            {aboutPagesData?.items?.map((page: any) => (
              <option key={page.id} value={page.id}>
                {page.heroTitle || page.id}
              </option>
            ))}
          </select>
        </div>

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
            placeholder="مثال: تاریخچه، ماموریت، چشم‌انداز"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        {/* Description */}
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            توضیحات <span className="text-red">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="توضیحات آیتم رزومه را وارد کنید"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-5.5 md:grid-cols-2">
          {/* Icon */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              آیکون
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon || ""}
              onChange={handleChange}
              placeholder="مثال: LuClock, LuTarget"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
            <p className="mt-1 text-body-xs text-dark-6">
              نام آیکون از Lucide React
            </p>
          </div>

          {/* Color */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              رنگ Gradient
            </label>
            <input
              type="text"
              name="color"
              value={formData.color || ""}
              onChange={handleChange}
              placeholder="مثال: from-blue-500 to-purple-500"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          {/* Background Color */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              رنگ پس‌زمینه
            </label>
            <input
              type="text"
              name="bgColor"
              value={formData.bgColor || ""}
              onChange={handleChange}
              placeholder="مثال: bg-blue-50"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          {/* Order */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              ترتیب نمایش
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* Published */}
        <div className="mb-5.5 mt-5">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="sr-only"
            />
            <div
              className={`flex h-5 w-5 items-center justify-center rounded border ${
                formData.published
                  ? "border-primary bg-primary"
                  : "border-stroke dark:border-dark-3"
              }`}
            >
              {formData.published && (
                <svg
                  className="h-3.5 w-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="text-body-sm font-medium text-dark dark:text-white">
              انتشار آیتم
            </span>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={createItem.isPending || updateItem.isPending}
            className="flex justify-center rounded-[7px] bg-primary px-6 py-[7px] font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {isEdit ? "به‌روزرسانی" : "ایجاد"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/resume-items")}
            className="flex justify-center rounded-[7px] border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeItemForm;
