"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateAboutPage,
  useUpdateAboutPage,
  useAboutPage,
} from "@/hooks/api";
import type { CreateAboutPageRequest } from "@/types/api";

interface AboutPageFormProps {
  aboutPageId?: string;
  isEdit?: boolean;
}

const AboutPageForm: React.FC<AboutPageFormProps> = ({
  aboutPageId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createAboutPage = useCreateAboutPage();
  const updateAboutPage = useUpdateAboutPage();
  const { data: aboutPageData } = useAboutPage(aboutPageId || "");

  const [formData, setFormData] = useState<CreateAboutPageRequest>({
    heroTitle: "",
    heroSubtitle: null,
    heroDescription: null,
    heroBadgeText: null,
    heroStats: [],
    resumeTitle: null,
    resumeSubtitle: null,
    teamTitle: null,
    teamSubtitle: null,
    certificatesTitle: null,
    certificatesSubtitle: null,
    newsTitle: null,
    newsSubtitle: null,
    ctaTitle: null,
    ctaDescription: null,
    ctaButtonText: null,
    ctaButtonLink: null,
    metaTitle: null,
    metaDescription: null,
    metaKeywords: [],
    published: true,
    order: 0,
  });

  useEffect(() => {
    if (isEdit && aboutPageData) {
      const data = aboutPageData;
      setFormData({
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle || null,
        heroDescription: data.heroDescription || null,
        heroBadgeText: data.heroBadgeText || null,
        heroStats: data.heroStats || [],
        resumeTitle: data.resumeTitle || null,
        resumeSubtitle: data.resumeSubtitle || null,
        teamTitle: data.teamTitle || null,
        teamSubtitle: data.teamSubtitle || null,
        certificatesTitle: data.certificatesTitle || null,
        certificatesSubtitle: data.certificatesSubtitle || null,
        newsTitle: data.newsTitle || null,
        newsSubtitle: data.newsSubtitle || null,
        ctaTitle: data.ctaTitle || null,
        ctaDescription: data.ctaDescription || null,
        ctaButtonText: data.ctaButtonText || null,
        ctaButtonLink: data.ctaButtonLink || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        metaKeywords: data.metaKeywords || [],
        published: data.published,
        order: data.order,
      });
    }
  }, [isEdit, aboutPageData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && aboutPageId) {
        await updateAboutPage.mutateAsync({ id: aboutPageId, data: formData });
        alert("صفحه درباره ما با موفقیت به‌روزرسانی شد");
        router.refresh();
      } else {
        await createAboutPage.mutateAsync(formData);
        alert("صفحه درباره ما با موفقیت ایجاد شد");
        router.refresh();
      }
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
          {isEdit ? "ویرایش صفحه درباره ما" : "افزودن صفحه درباره ما جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        {/* Hero Section */}
        <div className="mb-7">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            بخش هیرو (Hero)
          </h4>

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

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              متن نشان (Badge Text)
            </label>
            <input
              type="text"
              name="heroBadgeText"
              value={formData.heroBadgeText || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* Resume Section */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            بخش رزومه (Resume)
          </h4>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان
            </label>
            <input
              type="text"
              name="resumeTitle"
              value={formData.resumeTitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان فرعی
            </label>
            <input
              type="text"
              name="resumeSubtitle"
              value={formData.resumeSubtitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            بخش تیم (Team)
          </h4>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان
            </label>
            <input
              type="text"
              name="teamTitle"
              value={formData.teamTitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان فرعی
            </label>
            <input
              type="text"
              name="teamSubtitle"
              value={formData.teamSubtitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* Certificates Section */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            بخش گواهینامه‌ها (Certificates)
          </h4>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان
            </label>
            <input
              type="text"
              name="certificatesTitle"
              value={formData.certificatesTitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان فرعی
            </label>
            <input
              type="text"
              name="certificatesSubtitle"
              value={formData.certificatesSubtitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* News Section */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            بخش اخبار (News)
          </h4>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان
            </label>
            <input
              type="text"
              name="newsTitle"
              value={formData.newsTitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان فرعی
            </label>
            <input
              type="text"
              name="newsSubtitle"
              value={formData.newsSubtitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            بخش فراخوان (CTA)
          </h4>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان
            </label>
            <input
              type="text"
              name="ctaTitle"
              value={formData.ctaTitle || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              توضیحات
            </label>
            <textarea
              name="ctaDescription"
              value={formData.ctaDescription || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                متن دکمه
              </label>
              <input
                type="text"
                name="ctaButtonText"
                value={formData.ctaButtonText || ""}
                onChange={handleChange}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>

            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                لینک دکمه
              </label>
              <input
                type="text"
                name="ctaButtonLink"
                value={formData.ctaButtonLink || ""}
                onChange={handleChange}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Meta Section */}
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
            type="submit"
            disabled={createAboutPage.isPending || updateAboutPage.isPending}
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createAboutPage.isPending || updateAboutPage.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutPageForm;
