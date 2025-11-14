"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateCertificate,
  useUpdateCertificate,
  useCertificate,
  useAboutPages,
} from "@/hooks/api/use-about-page";
import type { CreateCertificateRequest } from "@/types/api";

interface CertificateFormProps {
  certId?: string;
  isEdit?: boolean;
}

const CertificateForm: React.FC<CertificateFormProps> = ({
  certId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createCert = useCreateCertificate();
  const updateCert = useUpdateCertificate();
  const { data: certData } = useCertificate(certId || "");
  const { data: aboutPagesData } = useAboutPages();

  const [formData, setFormData] = useState<CreateCertificateRequest>({
    aboutPageId: "",
    title: "",
    description: "",
    image: "",
    order: 0,
    published: true,
  });

  useEffect(() => {
    if (isEdit && certData) {
      const cert = certData;
      setFormData({
        aboutPageId: cert.aboutPageId,
        title: cert.title,
        description: cert.description || "",
        image: cert.image,
        order: cert.order,
        published: cert.published,
      });
    } else if (!isEdit && aboutPagesData?.items?.[0]?.id) {
      setFormData((prev) => ({
        ...prev,
        aboutPageId: aboutPagesData.items[0].id,
      }));
    }
  }, [isEdit, certData, aboutPagesData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && certId) {
        await updateCert.mutateAsync({ id: certId, data: formData });
        alert("گواهینامه با موفقیت به‌روزرسانی شد");
      } else {
        await createCert.mutateAsync(formData);
        alert("گواهینامه با موفقیت ایجاد شد");
      }
      router.push("/certificates");
    } catch (error: any) {
      alert(error?.message || "خطا در ذخیره گواهینامه");
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
          {isEdit ? "ویرایش گواهینامه" : "افزودن گواهینامه جدید"}
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
            عنوان گواهینامه <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="مثال: گواهینامه بورس، افتخار سال"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        {/* Description */}
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            توضیحات
          </label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows={3}
            placeholder="توضیحات درباره گواهینامه"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-5.5 md:grid-cols-2">
          {/* Image URL */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              تصویر (URL) <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              placeholder="https://example.com/certificate.jpg"
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

        {/* Image Preview */}
        {formData.image && (
          <div className="mb-5.5 mt-5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              پیش‌نمایش تصویر
            </label>
            <div className="rounded-lg border border-stroke p-4">
              <img
                src={formData.image}
                alt="Certificate preview"
                className="max-h-60 rounded object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>
        )}

        {/* Published */}
        <div className="mb-5.5">
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
              انتشار گواهینامه
            </span>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={createCert.isPending || updateCert.isPending}
            className="flex justify-center rounded-[7px] bg-primary px-6 py-[7px] font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {isEdit ? "به‌روزرسانی" : "ایجاد"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/certificates")}
            className="flex justify-center rounded-[7px] border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
};

export default CertificateForm;
