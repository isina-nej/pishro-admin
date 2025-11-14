"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateInvestmentPlans,
  useUpdateInvestmentPlans,
  useInvestmentPlansDetail,
} from "@/hooks/api";
import type { CreateInvestmentPlansRequest } from "@/types/api";

interface InvestmentPlansFormProps {
  plansId?: string;
  isEdit?: boolean;
}

interface IntroCard {
  title: string;
  description?: string;
}

const InvestmentPlansForm: React.FC<InvestmentPlansFormProps> = ({
  plansId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createInvestmentPlans = useCreateInvestmentPlans();
  const updateInvestmentPlans = useUpdateInvestmentPlans();
  const { data: investmentPlansData } = useInvestmentPlansDetail(plansId || "");

  const [formData, setFormData] = useState<CreateInvestmentPlansRequest>({
    title: "",
    description: "",
    image: null,
    plansIntroCards: [],
    minAmount: 10,
    maxAmount: 10000,
    amountStep: 10,
    metaTitle: null,
    metaDescription: null,
    metaKeywords: [],
    published: true,
  });

  const [introCardsUI, setIntroCardsUI] = useState<IntroCard[]>([]);
  const [metaKeywordsInput, setMetaKeywordsInput] = useState<string>("");

  useEffect(() => {
    if (isEdit && investmentPlansData) {
      const data = investmentPlansData;
      setFormData({
        title: data.title,
        description: data.description,
        image: data.image || null,
        plansIntroCards: data.plansIntroCards || [],
        minAmount: data.minAmount,
        maxAmount: data.maxAmount,
        amountStep: data.amountStep,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        metaKeywords: data.metaKeywords || [],
        published: data.published,
      });

      setIntroCardsUI(
        Array.isArray(data.plansIntroCards) ? (data.plansIntroCards as unknown as IntroCard[]) : []
      );
      setMetaKeywordsInput((data.metaKeywords || []).join(", "));
    }
  }, [isEdit, investmentPlansData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData = {
        ...formData,
        plansIntroCards: introCardsUI as any,
        metaKeywords: metaKeywordsInput
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k),
      };

      if (isEdit && plansId) {
        await updateInvestmentPlans.mutateAsync({
          id: plansId,
          data: submitData,
        });
        alert("صفحه سبدهای سرمایه‌گذاری با موفقیت به‌روزرسانی شد");
      } else {
        await createInvestmentPlans.mutateAsync(submitData);
        alert("صفحه سبدهای سرمایه‌گذاری با موفقیت ایجاد شد");
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
          : type === "number"
            ? value === ""
              ? 0
              : Number(value)
            : value === ""
              ? null
              : value,
    }));
  };

  const addIntroCard = () => {
    setIntroCardsUI([...introCardsUI, { title: "", description: "" }]);
  };

  const updateIntroCard = (
    index: number,
    field: keyof IntroCard,
    value: string
  ) => {
    const updated = [...introCardsUI];
    updated[index] = { ...updated[index], [field]: value };
    setIntroCardsUI(updated);
  };

  const removeIntroCard = (index: number) => {
    setIntroCardsUI(introCardsUI.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش صفحه سبدهای سرمایه‌گذاری" : "افزودن صفحه سبدهای سرمایه‌گذاری جدید"}
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

        {/* Intro Cards */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            کارت‌های معرفی
          </h4>

          <div className="space-y-4">
            {introCardsUI.map((card, index) => (
              <div
                key={index}
                className="rounded-[7px] border border-stroke p-4 dark:border-dark-3"
              >
                <div className="mb-3 flex justify-between">
                  <h5 className="font-medium text-dark dark:text-white">
                    کارت {index + 1}
                  </h5>
                  <button
                    type="button"
                    onClick={() => removeIntroCard(index)}
                    className="text-sm text-red hover:underline"
                  >
                    حذف
                  </button>
                </div>

                <div className="mb-3">
                  <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                    عنوان
                  </label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) =>
                      updateIntroCard(index, "title", e.target.value)
                    }
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                    توضیحات
                  </label>
                  <textarea
                    value={card.description || ""}
                    onChange={(e) =>
                      updateIntroCard(index, "description", e.target.value)
                    }
                    rows={2}
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addIntroCard}
              className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
            >
              افزودن کارت
            </button>
          </div>
        </div>

        {/* Slider Settings */}
        <div className="mb-7 border-t border-stroke pt-7 dark:border-dark-3">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            تنظیمات اسلایدر مقادیر
          </h4>

          <div className="mb-5.5 grid grid-cols-1 gap-5.5 sm:grid-cols-3">
            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                حداقل مقدار
              </label>
              <input
                type="number"
                name="minAmount"
                value={formData.minAmount}
                onChange={handleChange}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                حداکثر مقدار
              </label>
              <input
                type="number"
                name="maxAmount"
                value={formData.maxAmount}
                onChange={handleChange}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                گام افزایش
              </label>
              <input
                type="number"
                name="amountStep"
                value={formData.amountStep}
                onChange={handleChange}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>
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
              placeholder="مثال: سبد سرمایه‌گذاری, بورس, ارز دیجیتال"
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
            disabled={createInvestmentPlans.isPending || updateInvestmentPlans.isPending}
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createInvestmentPlans.isPending || updateInvestmentPlans.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvestmentPlansForm;
