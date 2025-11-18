"use client";

import React, { useState, useEffect } from "react";
import {
  useCreateInvestmentModel,
  useUpdateInvestmentModel,
  useInvestmentModel,
} from "@/hooks/api";
import type { CreateInvestmentModelRequest } from "@/types/api";
import { toast } from "sonner";

interface InvestmentModelFormProps {
  pageId: string;
  modelId?: string;
  isEdit?: boolean;
  onSuccess?: () => void;
  nextOrder?: number;
}

const InvestmentModelForm: React.FC<InvestmentModelFormProps> = ({
  pageId,
  modelId,
  isEdit = false,
  onSuccess,
  nextOrder = 0,
}) => {
  const createModel = useCreateInvestmentModel();
  const updateModel = useUpdateInvestmentModel();
  const { data: modelData } = useInvestmentModel(modelId || "");

  const [formData, setFormData] = useState<CreateInvestmentModelRequest>({
    investmentModelsPageId: pageId,
    type: "in-person",
    title: "",
    description: "",
    icon: "Building2",
    color: "green",
    gradient: "from-green-500 to-emerald-600",
    features: [],
    benefits: [],
    ctaText: "",
    ctaLink: null,
    ctaIsScroll: false,
    contactTitle: null,
    contactDescription: null,
    contacts: [],
    order: nextOrder,
  });

  // UI states for managing JSON and arrays
  const [featuresJSON, setFeaturesJSON] = useState<string>("[]");
  const [contactsJSON, setContactsJSON] = useState<string>("[]");
  const [benefitsInput, setBenefitsInput] = useState<string>("");

  useEffect(() => {
    if (isEdit && modelData) {
      const data = modelData.data;
      setFormData({
        investmentModelsPageId: pageId,
        type: data.type,
        title: data.title,
        description: data.description,
        icon: data.icon,
        color: data.color,
        gradient: data.gradient,
        features: data.features as any,
        benefits: data.benefits,
        ctaText: data.ctaText,
        ctaLink: data.ctaLink || null,
        ctaIsScroll: data.ctaIsScroll,
        contactTitle: data.contactTitle || null,
        contactDescription: data.contactDescription || null,
        contacts: data.contacts as any,
        order: data.order,
      });

      // Set UI states
      setFeaturesJSON(JSON.stringify(data.features, null, 2));
      setContactsJSON(JSON.stringify(data.contacts, null, 2));
      setBenefitsInput(data.benefits.join("\n"));
    }
  }, [isEdit, modelData, pageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Parse JSON fields
      let features: any = [];
      let contacts: any = [];

      try {
        features = JSON.parse(featuresJSON);
      } catch (e) {
        toast.error("فرمت JSON ویژگی‌ها (Features) نامعتبر است");
        return;
      }

      try {
        contacts = JSON.parse(contactsJSON);
      } catch (e) {
        toast.error("فرمت JSON اطلاعات تماس (Contacts) نامعتبر است");
        return;
      }

      const submitData = {
        ...formData,
        features,
        contacts,
        benefits: benefitsInput
          .split("\n")
          .map((b) => b.trim())
          .filter((b) => b),
      };

      if (isEdit && modelId) {
        await updateModel.mutateAsync({ id: modelId, data: submitData });
        toast.success("مدل با موفقیت به‌روزرسانی شد");
      } else {
        await createModel.mutateAsync(submitData);
        toast.success("مدل با موفقیت ایجاد شد");
      }

      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error?.message || "خطا در ذخیره مدل");
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
            : value === "" ? null : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Basic Info */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            نوع <span className="text-red">*</span>
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            <option value="in-person">حضوری</option>
            <option value="online">آنلاین</option>
          </select>
        </div>

        <div>
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
      </div>

      <div>
        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
          توضیحات <span className="text-red">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        />
      </div>

      {/* Styling */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            آیکون <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            required
            placeholder="مثال: Building2, Globe"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            رنگ <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
            placeholder="مثال: green, blue"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            Gradient <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="gradient"
            value={formData.gradient}
            onChange={handleChange}
            required
            placeholder="from-green-500 to-emerald-600"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>
      </div>

      {/* Features JSON */}
      <div>
        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
          ویژگی‌ها (Features) - JSON
        </label>
        <p className="mb-2 text-xs text-gray-500">
          مثال: {`[{"icon": "Users", "title": "مشاوره حضوری", "description": "..."}]`}
        </p>
        <textarea
          value={featuresJSON}
          onChange={(e) => setFeaturesJSON(e.target.value)}
          rows={6}
          className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 font-mono text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        />
      </div>

      {/* Benefits */}
      <div>
        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
          مزایا (Benefits) - هر خط یک مزیت
        </label>
        <textarea
          value={benefitsInput}
          onChange={(e) => setBenefitsInput(e.target.value)}
          rows={5}
          placeholder="هر مزیت را در یک خط جداگانه بنویسید"
          className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        />
      </div>

      {/* CTA */}
      <div className="rounded-[7px] border border-stroke p-5 dark:border-dark-3">
        <h5 className="mb-4 font-semibold text-dark dark:text-white">
          دکمه فراخوان (CTA)
        </h5>

        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              متن دکمه <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="ctaText"
              value={formData.ctaText}
              onChange={handleChange}
              required
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              لینک دکمه
            </label>
            <input
              type="text"
              name="ctaLink"
              value={formData.ctaLink || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name="ctaIsScroll"
              checked={formData.ctaIsScroll}
              onChange={handleChange}
              className="rounded border-stroke"
            />
            <span className="text-body-sm font-medium text-dark dark:text-white">
              اسکرول کردن (به جای لینک)
            </span>
          </label>
        </div>
      </div>

      {/* Contact Info */}
      <div className="rounded-[7px] border border-stroke p-5 dark:border-dark-3">
        <h5 className="mb-4 font-semibold text-dark dark:text-white">
          اطلاعات تماس (برای modal/drawer)
        </h5>

        <div className="mb-5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            عنوان
          </label>
          <input
            type="text"
            name="contactTitle"
            value={formData.contactTitle || ""}
            onChange={handleChange}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="mb-5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            توضیحات
          </label>
          <textarea
            name="contactDescription"
            value={formData.contactDescription || ""}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            راه‌های تماس (Contacts) - JSON
          </label>
          <p className="mb-2 text-xs text-gray-500">
            مثال: {`[{"icon": "Phone", "title": "تلفن تماس", "value": "021-12345678", "link": "tel:02112345678"}]`}
          </p>
          <textarea
            value={contactsJSON}
            onChange={(e) => setContactsJSON(e.target.value)}
            rows={6}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 font-mono text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>
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
          className="w-60 rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={createModel.isPending || updateModel.isPending}
          className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
        >
          {createModel.isPending || updateModel.isPending
            ? "در حال ذخیره..."
            : isEdit
              ? "به‌روزرسانی"
              : "ایجاد مدل"}
        </button>
      </div>
    </form>
  );
};

export default InvestmentModelForm;
