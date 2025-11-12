"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateFAQ,
  useUpdateFAQ,
  useFAQ,
} from "@/hooks/api/use-faqs";
import { useCategories } from "@/hooks/api/use-categories";
import type { CreateFAQRequest, FAQCategory } from "@/types/api";

interface FAQFormProps {
  faqId?: string;
  isEdit?: boolean;
}

const FAQForm: React.FC<FAQFormProps> = ({ faqId, isEdit = false }) => {
  const router = useRouter();
  const createFAQ = useCreateFAQ();
  const updateFAQ = useUpdateFAQ();
  const { data: faqData } = useFAQ(faqId || "");
  const { data: categoriesData } = useCategories({ limit: 100 });

  const [formData, setFormData] = useState<CreateFAQRequest>({
    question: "",
    answer: "",
    categoryId: null,
    faqCategory: null,
    order: 0,
    published: true,
    featured: false,
  });

  useEffect(() => {
    if (isEdit && faqData) {
      const faq = faqData;
      setFormData({
        question: faq.question,
        answer: faq.answer,
        categoryId: faq.categoryId || null,
        faqCategory: faq.faqCategory || null,
        order: faq.order || 0,
        published: faq.published,
        featured: faq.featured,
      });
    }
  }, [isEdit, faqData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && faqId) {
        await updateFAQ.mutateAsync({ id: faqId, data: formData });
        alert("سوال با موفقیت به‌روزرسانی شد");
      } else {
        await createFAQ.mutateAsync(formData);
        alert("سوال با موفقیت ایجاد شد");
      }
      router.push("/faqs");
    } catch (error: any) {
      alert(error?.message || "خطا در ذخیره سوال");
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
            : value === ""
              ? undefined
              : value,
    }));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش سوال" : "افزودن سوال جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            سوال <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="question"
            value={formData.question}
            onChange={handleChange}
            required
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            پاسخ <span className="text-red">*</span>
          </label>
          <textarea
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            required
            rows={6}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              دسته‌بندی محتوا
            </label>
            <select
              name="categoryId"
              value={formData.categoryId || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="">انتخاب کنید...</option>
              {categoriesData?.items?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              دسته‌بندی FAQ
            </label>
            <select
              name="faqCategory"
              value={formData.faqCategory || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="">انتخاب کنید...</option>
              <option value="GENERAL">عمومی</option>
              <option value="PAYMENT">پرداخت</option>
              <option value="COURSES">دوره‌ها</option>
              <option value="TECHNICAL">فنی</option>
            </select>
          </div>
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
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/faqs")}
            className="rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={createFAQ.isPending || updateFAQ.isPending}
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createFAQ.isPending || updateFAQ.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FAQForm;
