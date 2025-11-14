"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateHomeLanding,
  useUpdateHomeLanding,
  useHomeLandingDetail,
} from "@/hooks/api";
import type { CreateHomeLandingRequest } from "@/types/api";

interface HomeLandingFormProps {
  homeLandingId?: string;
  isEdit?: boolean;
}

const HomeLandingForm: React.FC<HomeLandingFormProps> = ({
  homeLandingId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createHomeLanding = useCreateHomeLanding();
  const updateHomeLanding = useUpdateHomeLanding();
  const { data: homeLandingData } = useHomeLandingDetail(homeLandingId || "");

  const [formData, setFormData] = useState<CreateHomeLandingRequest>({
    mainHeroTitle: null,
    mainHeroSubtitle: null,
    mainHeroCta1Text: null,
    mainHeroCta1Link: null,
    heroTitle: "",
    heroSubtitle: null,
    heroDescription: null,
    heroVideoUrl: null,
    heroCta1Text: null,
    heroCta1Link: null,
    overlayTexts: [],
    statsData: [],
    whyUsTitle: null,
    whyUsDescription: null,
    whyUsItems: [],
    newsClubTitle: null,
    newsClubDescription: null,
    metaTitle: null,
    metaDescription: null,
    metaKeywords: [],
    published: true,
    order: 0,
  });

  useEffect(() => {
    if (isEdit && homeLandingData) {
      const data = homeLandingData;
      setFormData({
        mainHeroTitle: data.mainHeroTitle || null,
        mainHeroSubtitle: data.mainHeroSubtitle || null,
        mainHeroCta1Text: data.mainHeroCta1Text || null,
        mainHeroCta1Link: data.mainHeroCta1Link || null,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle || null,
        heroDescription: data.heroDescription || null,
        heroVideoUrl: data.heroVideoUrl || null,
        heroCta1Text: data.heroCta1Text || null,
        heroCta1Link: data.heroCta1Link || null,
        overlayTexts: data.overlayTexts || [],
        statsData: data.statsData || [],
        whyUsTitle: data.whyUsTitle || null,
        whyUsDescription: data.whyUsDescription || null,
        whyUsItems: data.whyUsItems || [],
        newsClubTitle: data.newsClubTitle || null,
        newsClubDescription: data.newsClubDescription || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        metaKeywords: data.metaKeywords || [],
        published: data.published,
        order: data.order,
      });
    }
  }, [isEdit, homeLandingData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && homeLandingId) {
        await updateHomeLanding.mutateAsync({ id: homeLandingId, data: formData });
        alert("صفحه لندینگ با موفقیت به‌روزرسانی شد");
      } else {
        await createHomeLanding.mutateAsync(formData);
        alert("صفحه لندینگ با موفقیت ایجاد شد");
      }
      router.push("/home-landing");
    } catch (error: any) {
      alert(error?.message || "خطا در ذخیره صفحه");
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
            ? value === "" ? null : Number(value)
            : value === "" ? null : value,
    }));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش صفحه لندینگ" : "افزودن صفحه لندینگ جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        {/* Hero Section */}
        <div className="mb-7">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">بخش هیرو (Hero)</h4>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان اصلی <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="heroTitle"
              value={formData.heroTitle}
              onChange={handleChange}
              required
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان فرعی
            </label>
            <input
              type="text"
              name="heroSubtitle"
              value={formData.heroSubtitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              توضیحات
            </label>
            <textarea
              name="heroDescription"
              value={formData.heroDescription || ""}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                لینک ویدیو پس‌زمینه
              </label>
              <input
                type="text"
                name="heroVideoUrl"
                value={formData.heroVideoUrl || ""}
                onChange={handleChange}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>

            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                متن دکمه CTA
              </label>
              <input
                type="text"
                name="heroCta1Text"
                value={formData.heroCta1Text || ""}
                onChange={handleChange}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              لینک دکمه CTA
            </label>
            <input
              type="text"
              name="heroCta1Link"
              value={formData.heroCta1Link || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* Why Us Section */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">بخش چرا ما (Why Us)</h4>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان
            </label>
            <input
              type="text"
              name="whyUsTitle"
              value={formData.whyUsTitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              توضیحات
            </label>
            <textarea
              name="whyUsDescription"
              value={formData.whyUsDescription || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* News Club Section */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">بخش باشگاه خبری</h4>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان
            </label>
            <input
              type="text"
              name="newsClubTitle"
              value={formData.newsClubTitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              توضیحات
            </label>
            <textarea
              name="newsClubDescription"
              value={formData.newsClubDescription || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* Meta Section */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">تنظیمات SEO</h4>

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
        </div>

        {/* Settings */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">تنظیمات</h4>

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

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              ترتیب نمایش
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              className="w-60 rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/home-landing")}
            className="rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={createHomeLanding.isPending || updateHomeLanding.isPending}
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createHomeLanding.isPending || updateHomeLanding.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomeLandingForm;
