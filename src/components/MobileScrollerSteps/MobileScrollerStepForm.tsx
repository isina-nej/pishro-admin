"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateMobileScrollerStep,
  useUpdateMobileScrollerStep,
  useMobileScrollerStep,
} from "@/hooks/api";
import { toast } from "sonner";
import type { CreateMobileScrollerStepRequest } from "@/types/api";
import ImageUpload from "@/components/ImageUpload";

interface MobileScrollerStepFormProps {
  stepId?: string;
  isEdit?: boolean;
}

const MobileScrollerStepForm: React.FC<MobileScrollerStepFormProps> = ({
  stepId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createStep = useCreateMobileScrollerStep();
  const updateStep = useUpdateMobileScrollerStep();
  const { data: stepData } = useMobileScrollerStep(stepId || "");

  const [formData, setFormData] = useState<CreateMobileScrollerStepRequest>({
    stepNumber: 1,
    title: "",
    description: "",
    imageUrl: null,
    coverImageUrl: null,
    gradient: null,
    link: null,
    order: 0,
    published: true,
  });

  useEffect(() => {
    if (isEdit && stepData) {
      const data = stepData.data;
      setFormData({
        stepNumber: data.stepNumber,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl || null,
        coverImageUrl: data.coverImageUrl || null,
        gradient: data.gradient || null,
        link: data.link || null,
        order: data.order,
        published: data.published,
      });
    }
  }, [isEdit, stepData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Debug: نمایش داده‌های ارسالی
    console.log("📤 Data being sent to API:", formData);
    console.log("🔗 Link value:", formData.link, "Type:", typeof formData.link);

    try {
      if (isEdit && stepId) {
        await updateStep.mutateAsync({ id: stepId, data: formData });
        toast.success("مرحله با موفقیت به‌روزرسانی شد");
        router.refresh();
      } else {
        await createStep.mutateAsync(formData);
        toast.success("مرحله با موفقیت ایجاد شد");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error?.message || "خطا در ذخیره مرحله");
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
            ? value === "" ? 0 : Number(value)
            : (() => {
                const trimmedValue = value.trim();
                return trimmedValue === "" ? null : trimmedValue;
              })(),
    }));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش مرحله اسکرولر" : "افزودن مرحله اسکرولر جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              شماره مرحله <span className="text-red">*</span>
            </label>
            <input
              type="number"
              name="stepNumber"
              value={formData.stepNumber}
              onChange={handleChange}
              required
              min="1"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

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
          <ImageUpload
            label="تصویر داخل موبایل"
            name="imageUrl"
            value={formData.imageUrl || ""}
            onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
            category="LANDING"
            showPreview={true}
            previewWidth={200}
            previewHeight={350}
            alt="تصویر داخل موبایل"
          />
        </div>

        <div className="mb-5.5">
          <ImageUpload
            label="تصویر پس‌زمینه موبایل"
            name="coverImageUrl"
            value={formData.coverImageUrl || ""}
            onChange={(url) => setFormData((prev) => ({ ...prev, coverImageUrl: url }))}
            category="LANDING"
            showPreview={true}
            previewWidth={250}
            previewHeight={400}
            alt="تصویر پس‌زمینه موبایل"
          />
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            کلاس Gradient (CSS)
          </label>
          <input
            type="text"
            name="gradient"
            value={formData.gradient || ""}
            onChange={handleChange}
            placeholder="مثال: from-blue-500 to-purple-500"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            لینک دکمه اطلاعات بیشتر
          </label>
          <input
            type="text"
            name="link"
            value={formData.link || ""}
            onChange={handleChange}
            placeholder="مثال: /courses"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
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
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={createStep.isPending || updateStep.isPending}
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createStep.isPending || updateStep.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MobileScrollerStepForm;
