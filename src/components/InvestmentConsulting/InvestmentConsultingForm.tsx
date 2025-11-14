"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateInvestmentConsulting,
  useUpdateInvestmentConsulting,
  useInvestmentConsultingDetail,
} from "@/hooks/api";
import type { CreateInvestmentConsultingRequest } from "@/types/api";

interface InvestmentConsultingFormProps {
  consultingId?: string;
  isEdit?: boolean;
}

const InvestmentConsultingForm: React.FC<InvestmentConsultingFormProps> = ({
  consultingId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createInvestmentConsulting = useCreateInvestmentConsulting();
  const updateInvestmentConsulting = useUpdateInvestmentConsulting();
  const { data: consultingData } = useInvestmentConsultingDetail(
    consultingId || ""
  );

  const [formData, setFormData] = useState<CreateInvestmentConsultingRequest>({
    title: "",
    description: "",
    image: null,
    phoneNumber: null,
    telegramId: null,
    telegramLink: null,
    coursesLink: null,
    inPersonTitle: null,
    inPersonDescription: null,
    onlineTitle: null,
    onlineDescription: null,
    coursesTitle: null,
    coursesDescription: null,
    metaTitle: null,
    metaDescription: null,
    metaKeywords: [],
    published: true,
  });

  const [metaKeywordsInput, setMetaKeywordsInput] = useState<string>("");

  useEffect(() => {
    if (isEdit && consultingData) {
      const data = consultingData;
      setFormData({
        title: data.title,
        description: data.description,
        image: data.image || null,
        phoneNumber: data.phoneNumber || null,
        telegramId: data.telegramId || null,
        telegramLink: data.telegramLink || null,
        coursesLink: data.coursesLink || null,
        inPersonTitle: data.inPersonTitle || null,
        inPersonDescription: data.inPersonDescription || null,
        onlineTitle: data.onlineTitle || null,
        onlineDescription: data.onlineDescription || null,
        coursesTitle: data.coursesTitle || null,
        coursesDescription: data.coursesDescription || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        metaKeywords: data.metaKeywords || [],
        published: data.published,
      });

      setMetaKeywordsInput((data.metaKeywords || []).join(", "));
    }
  }, [isEdit, consultingData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData = {
        ...formData,
        metaKeywords: metaKeywordsInput
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k),
      };

      if (isEdit && consultingId) {
        await updateInvestmentConsulting.mutateAsync({
          id: consultingId,
          data: submitData,
        });
        alert("صفحه مشاوره سرمایه‌گذاری با موفقیت به‌روزرسانی شد");
      } else {
        await createInvestmentConsulting.mutateAsync(submitData);
        alert("صفحه مشاوره سرمایه‌گذاری با موفقیت ایجاد شد");
      }
      router.refresh();
    } catch (error: any) {
      alert(error?.message || "خطا در ذخیره صفحه");
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value === ""
            ? null
            : value,
    }));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش صفحه مشاوره سرمایه‌گذاری" : "افزودن صفحه مشاوره سرمایه‌گذاری جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        {/* Landing Content */}
        <div className="mb-7">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            محتوای صفحه اصلی
          </h4>

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
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
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
              rows={4}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              تصویر (URL)
            </label>
            <input
              type="text"
              name="image"
              value={formData.image || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            اطلاعات تماس
          </h4>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              شماره تلفن
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              آیدی تلگرام
            </label>
            <input
              type="text"
              name="telegramId"
              value={formData.telegramId || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              لینک تلگرام
            </label>
            <input
              type="text"
              name="telegramLink"
              value={formData.telegramLink || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              لینک دوره‌ها
            </label>
            <input
              type="text"
              name="coursesLink"
              value={formData.coursesLink || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* Drawer Content */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            محتوای Drawer
          </h4>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان حضوری
            </label>
            <input
              type="text"
              name="inPersonTitle"
              value={formData.inPersonTitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              توضیحات حضوری
            </label>
            <textarea
              name="inPersonDescription"
              value={formData.inPersonDescription || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان آنلاین
            </label>
            <input
              type="text"
              name="onlineTitle"
              value={formData.onlineTitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              توضیحات آنلاین
            </label>
            <textarea
              name="onlineDescription"
              value={formData.onlineDescription || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان دوره‌ها
            </label>
            <input
              type="text"
              name="coursesTitle"
              value={formData.coursesTitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              توضیحات دوره‌ها
            </label>
            <textarea
              name="coursesDescription"
              value={formData.coursesDescription || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* Meta Tags */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            تنظیمات SEO
          </h4>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان متا
            </label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              توضیحات متا
            </label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              کلمات کلیدی (با کاما جدا کنید)
            </label>
            <input
              type="text"
              value={metaKeywordsInput}
              onChange={(e) => setMetaKeywordsInput(e.target.value)}
              placeholder="مثال: مشاوره, سرمایه‌گذاری, آموزش"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* Settings */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            تنظیمات
          </h4>

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
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={createInvestmentConsulting.isPending || updateInvestmentConsulting.isPending}
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createInvestmentConsulting.isPending || updateInvestmentConsulting.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvestmentConsultingForm;
