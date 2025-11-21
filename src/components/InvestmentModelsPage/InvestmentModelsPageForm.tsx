"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateInvestmentModelsPage,
  useUpdateInvestmentModelsPage,
  useInvestmentModelsPage,
} from "@/hooks/api/use-investment-models-page";
import { toast } from "sonner";
import type { CreateInvestmentModelsPageRequest } from "@/types/api";

interface InvestmentModelsPageFormProps {
  pageId?: string;
  isEdit?: boolean;
}

const InvestmentModelsPageForm: React.FC<InvestmentModelsPageFormProps> = ({
  pageId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createPage = useCreateInvestmentModelsPage();
  const updatePage = useUpdateInvestmentModelsPage();
  const { data: pageData } = useInvestmentModelsPage(pageId || "");

  const [formData, setFormData] = useState<CreateInvestmentModelsPageRequest>({
    additionalInfoTitle: "",
    additionalInfoContent: "",
    published: true,
  });

  useEffect(() => {
    if (isEdit && pageData) {
      const page = pageData.data;
      setFormData({
        additionalInfoTitle: page.additionalInfoTitle || "",
        additionalInfoContent: page.additionalInfoContent || "",
        published: page.published,
      });
    }
  }, [isEdit, pageData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && pageId) {
        await updatePage.mutateAsync({ id: pageId, data: formData });
        toast.success("صفحه با موفقیت به‌روزرسانی شد");
      } else {
        await createPage.mutateAsync(formData);
        toast.success("صفحه با موفقیت ایجاد شد");
      }
      router.push("/investment-models-page");
    } catch (error: any) {
      toast.error(error?.message || "خطا در ذخیره صفحه");
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش صفحه مدل‌های سرمایه‌گذاری" : "افزودن صفحه مدل‌های سرمایه‌گذاری جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        {/* Additional Info Title */}
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            عنوان اطلاعات اضافی
          </label>
          <input
            type="text"
            name="additionalInfoTitle"
            value={formData.additionalInfoTitle || ""}
            onChange={handleChange}
            placeholder="عنوان بخش اطلاعات اضافی"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        {/* Additional Info Content */}
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            محتوای اطلاعات اضافی
          </label>
          <textarea
            name="additionalInfoContent"
            value={formData.additionalInfoContent || ""}
            onChange={handleChange}
            rows={6}
            placeholder="محتوای بخش اطلاعات اضافی..."
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        {/* Published Checkbox */}
        <div className="mb-5.5">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="h-5 w-5 rounded border-stroke bg-white dark:border-dark-3 dark:bg-dark-2"
            />
            <span className="text-body-sm font-medium text-dark dark:text-white">
              انتشار این صفحه
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={createPage.isPending || updatePage.isPending}
            className="inline-flex items-center justify-center rounded bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createPage.isPending || updatePage.isPending
              ? "در حال ذخیره..."
              : isEdit
                ? "به‌روزرسانی"
                : "ایجاد"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/investment-models-page")}
            className="inline-flex items-center justify-center rounded border border-stroke px-6 py-3 font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvestmentModelsPageForm;
