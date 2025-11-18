"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateInvestmentModelsPage,
  useUpdateInvestmentModelsPage,
  useInvestmentModelsPage,
  useInvestmentModels,
} from "@/hooks/api";
import type { CreateInvestmentModelsPageRequest } from "@/types/api";
import { toast } from "sonner";
import InvestmentModelsList from "./InvestmentModelsList";

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
  const { data: modelsData, refetch: refetchModels } = useInvestmentModels({
    investmentModelsPageId: pageId,
    page: 1,
    limit: 100,
  });

  const [formData, setFormData] = useState<CreateInvestmentModelsPageRequest>({
    additionalInfoTitle: null,
    additionalInfoContent: null,
    published: true,
  });

  useEffect(() => {
    if (isEdit && pageData) {
      const data = pageData.data;
      setFormData({
        additionalInfoTitle: data.additionalInfoTitle || null,
        additionalInfoContent: data.additionalInfoContent || null,
        published: data.published,
      });
    }
  }, [isEdit, pageData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && pageId) {
        await updatePage.mutateAsync({
          id: pageId,
          data: formData,
        });
        toast.success("صفحه مدل‌های سرمایه‌گذاری با موفقیت به‌روزرسانی شد");
      } else {
        const result = await createPage.mutateAsync(formData);
        toast.success("صفحه مدل‌های سرمایه‌گذاری با موفقیت ایجاد شد");
        // Redirect to edit mode after creating
        if (result.data && 'id' in result.data) {
          router.refresh();
        }
      }
    } catch (error: any) {
      toast.error(error?.message || "خطا در ذخیره صفحه");
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
          : value === ""
            ? null
            : value,
    }));
  };

  const handleTogglePublish = async () => {
    if (!pageId) return;

    try {
      await updatePage.mutateAsync({
        id: pageId,
        data: { published: !formData.published },
      });
      setFormData((prev) => ({ ...prev, published: !prev.published }));
      toast.success(
        formData.published
          ? "صفحه با موفقیت پنهان شد"
          : "صفحه با موفقیت منتشر شد"
      );
    } catch (error: any) {
      toast.error(error?.message || "خطا در تغییر وضعیت انتشار");
      console.error(error);
    }
  };

  return (
    <>
      <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-dark dark:text-white">
              {isEdit
                ? "ویرایش صفحه مدل‌های سرمایه‌گذاری"
                : "افزودن صفحه مدل‌های سرمایه‌گذاری جدید"}
            </h3>
            {isEdit && pageId && (
              <button
                type="button"
                onClick={handleTogglePublish}
                className={`rounded px-4 py-2 font-medium text-white transition ${
                  formData.published
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {formData.published ? "پنهان کردن" : "انتشار"}
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-7">
          {/* Additional Info Section */}
          <div className="mb-7">
            <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              اطلاعات تکمیلی (توجه مهم در انتها)
            </h4>

            <div className="mb-5.5">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                عنوان
              </label>
              <input
                type="text"
                name="additionalInfoTitle"
                value={formData.additionalInfoTitle || ""}
                onChange={handleChange}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>

            <div className="mb-5.5">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                محتوا
              </label>
              <textarea
                name="additionalInfoContent"
                value={formData.additionalInfoContent || ""}
                onChange={handleChange}
                rows={4}
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
              disabled={createPage.isPending || updatePage.isPending}
              className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
            >
              {createPage.isPending || updatePage.isPending
                ? "در حال ذخیره..."
                : "ذخیره"}
            </button>
          </div>
        </form>
      </div>

      {/* Investment Models List */}
      {isEdit && pageId && (
        <InvestmentModelsList
          pageId={pageId}
          models={modelsData?.data?.items || []}
          onModelsChange={refetchModels}
        />
      )}
    </>
  );
};

export default InvestmentModelsPageForm;
