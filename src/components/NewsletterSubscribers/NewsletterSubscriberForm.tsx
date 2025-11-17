"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateNewsletterSubscriber,
  useUpdateNewsletterSubscriber,
  useNewsletterSubscriber,
} from "@/hooks/api/use-newsletter-subscribers";
import { toast } from "sonner";
import type { CreateNewsletterSubscriberRequest } from "@/hooks/api/use-newsletter-subscribers";

interface NewsletterSubscriberFormProps {
  subscriberId?: string;
  isEdit?: boolean;
}

const NewsletterSubscriberForm: React.FC<NewsletterSubscriberFormProps> = ({
  subscriberId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createSubscriber = useCreateNewsletterSubscriber();
  const updateSubscriber = useUpdateNewsletterSubscriber();
  const { data: subscriberData } = useNewsletterSubscriber(subscriberId || "");

  const [formData, setFormData] = useState<CreateNewsletterSubscriberRequest>({
    phone: "",
  });

  useEffect(() => {
    if (isEdit && subscriberData) {
      setFormData({
        phone: subscriberData.phone,
      });
    }
  }, [isEdit, subscriberData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number format (Iranian phone numbers)
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("شماره تلفن باید با 09 شروع شود و 11 رقم باشد");
      return;
    }

    try {
      if (isEdit && subscriberId) {
        await updateSubscriber.mutateAsync({ id: subscriberId, data: formData });
        toast.success("مشترک با موفقیت به‌روزرسانی شد");
      } else {
        await createSubscriber.mutateAsync(formData);
        toast.success("مشترک با موفقیت ایجاد شد");
      }
      router.push("/newsletter-subscribers");
    } catch (error: any) {
      toast.error(error?.message || "خطا در ذخیره مشترک");
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش مشترک خبرنامه" : "افزودن مشترک جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            شماره تلفن <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="09123456789"
            required
            pattern="09\d{9}"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
          <p className="mt-1.5 text-body-sm text-body">
            شماره تلفن باید با 09 شروع شود و 11 رقم باشد
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/newsletter-subscribers")}
            className="rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={createSubscriber.isPending || updateSubscriber.isPending}
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createSubscriber.isPending || updateSubscriber.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsletterSubscriberForm;
