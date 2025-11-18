"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateCategory,
  useUpdateCategory,
  useCategory,
} from "@/hooks/api/use-categories";
import { toast } from "sonner";
import type { CreateCategoryRequest, StatsBox } from "@/types/api";
import ImageUpload from "@/components/ImageUpload";

interface CategoryFormProps {
  categoryId?: string;
  isEdit?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  categoryId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const { data: categoryData } = useCategory(categoryId || "");

  const [formData, setFormData] = useState<CreateCategoryRequest>({
    slug: "",
    title: "",
    description: "",
    icon: "",
    coverImage: "",
    color: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
    heroTitle: "",
    heroSubtitle: "",
    heroDescription: "",
    heroImage: "",
    heroCta1Text: "",
    heroCta1Link: "",
    heroCta2Text: "",
    heroCta2Link: "",
    aboutTitle1: "",
    aboutTitle2: "",
    aboutDescription: "",
    aboutImage: "",
    aboutCta1Text: "",
    aboutCta1Link: "",
    aboutCta2Text: "",
    aboutCta2Link: "",
    statsBoxes: [],
    enableUserLevelSection: false,
    published: true,
    featured: false,
    order: 0,
    tagIds: [],
  });

  useEffect(() => {
    if (isEdit && categoryData) {
      const category = categoryData.data;

      // Parse statsBoxes from JSON if needed
      let parsedStatsBoxes: StatsBox[] = [];
      if (category.statsBoxes) {
        if (Array.isArray(category.statsBoxes)) {
          parsedStatsBoxes = category.statsBoxes as unknown as StatsBox[];
        } else if (typeof category.statsBoxes === 'string') {
          try {
            parsedStatsBoxes = JSON.parse(category.statsBoxes) as StatsBox[];
          } catch {
            parsedStatsBoxes = [];
          }
        }
      }

      setFormData({
        slug: category.slug,
        title: category.title,
        description: category.description || "",
        icon: category.icon || "",
        coverImage: category.coverImage || "",
        color: category.color || "",
        metaTitle: category.metaTitle || "",
        metaDescription: category.metaDescription || "",
        metaKeywords: category.metaKeywords || [],
        heroTitle: category.heroTitle || "",
        heroSubtitle: category.heroSubtitle || "",
        heroDescription: category.heroDescription || "",
        heroImage: category.heroImage || "",
        heroCta1Text: category.heroCta1Text || "",
        heroCta1Link: category.heroCta1Link || "",
        heroCta2Text: category.heroCta2Text || "",
        heroCta2Link: category.heroCta2Link || "",
        aboutTitle1: category.aboutTitle1 || "",
        aboutTitle2: category.aboutTitle2 || "",
        aboutDescription: category.aboutDescription || "",
        aboutImage: category.aboutImage || "",
        aboutCta1Text: category.aboutCta1Text || "",
        aboutCta1Link: category.aboutCta1Link || "",
        aboutCta2Text: category.aboutCta2Text || "",
        aboutCta2Link: category.aboutCta2Link || "",
        statsBoxes: parsedStatsBoxes,
        enableUserLevelSection: category.enableUserLevelSection || false,
        published: category.published,
        featured: category.featured,
        order: category.order || 0,
        tagIds: category.tagIds || [],
      });
    }
  }, [isEdit, categoryData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && categoryId) {
        await updateCategory.mutateAsync({ id: categoryId, data: formData });
        toast.success("دسته‌بندی با موفقیت به‌روزرسانی شد");
      } else {
        await createCategory.mutateAsync(formData);
        toast.success("دسته‌بندی با موفقیت ایجاد شد");
      }
      router.push("/categories");
    } catch (error: any) {
      toast.error(error?.message || "خطا در ذخیره دسته‌بندی");
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

  const handleKeywordsChange = (value: string) => {
    const keywords = value.split(",").map((k) => k.trim()).filter((k) => k);
    setFormData((prev) => ({ ...prev, metaKeywords: keywords }));
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(",").map((t) => t.trim()).filter((t) => t);
    setFormData((prev) => ({ ...prev, tagIds: tags }));
  };

  const addStatsBox = () => {
    setFormData((prev) => ({
      ...prev,
      statsBoxes: [...prev.statsBoxes, { title: "", value: "", icon: "" }],
    }));
  };

  const removeStatsBox = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      statsBoxes: prev.statsBoxes.filter((_, i) => i !== index),
    }));
  };

  const handleStatsBoxChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      statsBoxes: prev.statsBoxes.map((box, i) =>
        i === index ? { ...box, [field]: value } : box,
      ),
    }));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        {/* اطلاعات پایه */}
        <div className="mb-8">
          <h4 className="mb-5 text-lg font-semibold text-dark dark:text-white">
            اطلاعات پایه
          </h4>

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
              توضیحات
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/3">
              <ImageUpload
                label="آیکون دسته‌بندی"
                name="icon"
                value={formData.icon || ""}
                onChange={(url) => setFormData((prev) => ({ ...prev, icon: url }))}
                category="LANDING"
                showPreview={true}
                previewWidth={100}
                previewHeight={100}
                alt="آیکون دسته‌بندی"
              />
            </div>

            <div className="w-full sm:w-1/3">
              <ImageUpload
                label="تصویر کاور"
                name="coverImage"
                value={formData.coverImage || ""}
                onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
                category="LANDING"
                showPreview={true}
                previewWidth={120}
                previewHeight={80}
                alt="تصویر کاور دسته‌بندی"
              />
            </div>

            <div className="w-full sm:w-1/3">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                رنگ (Hex Code)
              </label>
              <input
                type="text"
                name="color"
                value={formData.color || ""}
                onChange={handleChange}
                placeholder="#000000"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>
          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                ترتیب نمایش
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
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

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                name="enableUserLevelSection"
                checked={formData.enableUserLevelSection}
                onChange={handleChange}
                className="rounded border-stroke"
              />
              <span className="text-body-sm font-medium text-dark dark:text-white">
                فعال‌سازی بخش سطح کاربر
              </span>
            </label>
          </div>
        </div>

        {/* تنظیمات SEO */}
        <div className="mb-8 border-t border-stroke pt-8 dark:border-dark-3">
          <h4 className="mb-5 text-lg font-semibold text-dark dark:text-white">
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
              کلمات کلیدی متا (با کاما جدا کنید)
            </label>
            <input
              type="text"
              value={(formData.metaKeywords || []).join(", ")}
              onChange={(e) => handleKeywordsChange(e.target.value)}
              placeholder="کلمه1, کلمه2, کلمه3"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* بخش Hero */}
        <div className="mb-8 border-t border-stroke pt-8 dark:border-dark-3">
          <h4 className="mb-5 text-lg font-semibold text-dark dark:text-white">
            بخش Hero
          </h4>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                عنوان Hero
              </label>
              <input
                type="text"
                name="heroTitle"
                value={formData.heroTitle || ""}
                onChange={handleChange}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>

            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                زیرعنوان Hero
              </label>
              <input
                type="text"
                name="heroSubtitle"
                value={formData.heroSubtitle || ""}
                onChange={handleChange}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              توضیحات Hero
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
            <ImageUpload
              label="تصویر بخش Hero"
              name="heroImage"
              value={formData.heroImage || ""}
              onChange={(url) => setFormData((prev) => ({ ...prev, heroImage: url }))}
              category="LANDING"
              showPreview={true}
              previewWidth={300}
              previewHeight={200}
              alt="تصویر Hero دسته‌بندی"
            />
          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                متن دکمه اول Hero
              </label>
              <input
                type="text"
                name="heroCta1Text"
                value={formData.heroCta1Text || ""}
                onChange={handleChange}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>

            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                لینک دکمه اول Hero
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

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                متن دکمه دوم Hero
              </label>
              <input
                type="text"
                name="heroCta2Text"
                value={formData.heroCta2Text || ""}
                onChange={handleChange}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>

            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                لینک دکمه دوم Hero
              </label>
              <input
                type="text"
                name="heroCta2Link"
                value={formData.heroCta2Link || ""}
                onChange={handleChange}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* بخش About */}
        <div className="mb-8 border-t border-stroke pt-8 dark:border-dark-3">
          <h4 className="mb-5 text-lg font-semibold text-dark dark:text-white">
            بخش About
          </h4>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                عنوان اول About
              </label>
              <input
                type="text"
                name="aboutTitle1"
                value={formData.aboutTitle1 || ""}
                onChange={handleChange}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>

            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                عنوان دوم About
              </label>
              <input
                type="text"
                name="aboutTitle2"
                value={formData.aboutTitle2 || ""}
                onChange={handleChange}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              توضیحات About
            </label>
            <textarea
              name="aboutDescription"
              value={formData.aboutDescription || ""}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5">
            <ImageUpload
              label="تصویر بخش About"
              name="aboutImage"
              value={formData.aboutImage || ""}
              onChange={(url) => setFormData((prev) => ({ ...prev, aboutImage: url }))}
              category="LANDING"
              showPreview={true}
              previewWidth={300}
              previewHeight={200}
              alt="تصویر About دسته‌بندی"
            />
          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                متن دکمه اول About
              </label>
              <input
                type="text"
                name="aboutCta1Text"
                value={formData.aboutCta1Text || ""}
                onChange={handleChange}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>

            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                لینک دکمه اول About
              </label>
              <input
                type="text"
                name="aboutCta1Link"
                value={formData.aboutCta1Link || ""}
                onChange={handleChange}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>
          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                متن دکمه دوم About
              </label>
              <input
                type="text"
                name="aboutCta2Text"
                value={formData.aboutCta2Text || ""}
                onChange={handleChange}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>

            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                لینک دکمه دوم About
              </label>
              <input
                type="text"
                name="aboutCta2Link"
                value={formData.aboutCta2Link || ""}
                onChange={handleChange}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* آمار و تگ‌ها */}
        <div className="mb-8 border-t border-stroke pt-8 dark:border-dark-3">
          <h4 className="mb-5 text-lg font-semibold text-dark dark:text-white">
            آمار و تگ‌ها
          </h4>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              باکس‌های آمار
            </label>
            {formData.statsBoxes.map((box, index) => (
              <div
                key={index}
                className="mb-4 flex flex-col gap-3 rounded-[7px] border border-stroke p-4 dark:border-dark-3"
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    placeholder="عنوان"
                    value={box.title}
                    onChange={(e) =>
                      handleStatsBoxChange(index, "title", e.target.value)
                    }
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="مقدار"
                    value={box.value}
                    onChange={(e) =>
                      handleStatsBoxChange(index, "value", e.target.value)
                    }
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="آیکون (URL)"
                    value={box.icon}
                    onChange={(e) =>
                      handleStatsBoxChange(index, "icon", e.target.value)
                    }
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeStatsBox(index)}
                  className="self-start rounded bg-red px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
                >
                  حذف
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addStatsBox}
              className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
            >
              افزودن باکس آمار
            </button>
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              تگ‌ها (با کاما جدا کنید)
            </label>
            <input
              type="text"
              value={(formData.tagIds || []).join(", ")}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="tag1, tag2, tag3"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/categories")}
            className="rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={createCategory.isPending || updateCategory.isPending}
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createCategory.isPending || updateCategory.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
