"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateTeamMember,
  useUpdateTeamMember,
  useTeamMember,
  useAboutPages,
} from "@/hooks/api/use-about-page";
import type { CreateTeamMemberRequest } from "@/types/api";

interface TeamMemberFormProps {
  memberId?: string;
  isEdit?: boolean;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({
  memberId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createMember = useCreateTeamMember();
  const updateMember = useUpdateTeamMember();
  const { data: memberData } = useTeamMember(memberId || "");
  const { data: aboutPagesData } = useAboutPages();

  const [formData, setFormData] = useState<CreateTeamMemberRequest>({
    aboutPageId: "",
    name: "",
    role: "",
    image: "",
    education: "",
    description: "",
    specialties: [],
    linkedinUrl: "",
    emailUrl: "",
    twitterUrl: "",
    order: 0,
    published: true,
  });

  const [specialtyInput, setSpecialtyInput] = useState("");

  useEffect(() => {
    if (isEdit && memberData) {
      const member = memberData;
      setFormData({
        aboutPageId: member.aboutPageId,
        name: member.name,
        role: member.role,
        image: member.image || "",
        education: member.education || "",
        description: member.description || "",
        specialties: member.specialties || [],
        linkedinUrl: member.linkedinUrl || "",
        emailUrl: member.emailUrl || "",
        twitterUrl: member.twitterUrl || "",
        order: member.order,
        published: member.published,
      });
    } else if (!isEdit && aboutPagesData?.items?.[0]?.id) {
      setFormData((prev) => ({
        ...prev,
        aboutPageId: aboutPagesData.items[0].id,
      }));
    }
  }, [isEdit, memberData, aboutPagesData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && memberId) {
        await updateMember.mutateAsync({ id: memberId, data: formData });
        alert("عضو تیم با موفقیت به‌روزرسانی شد");
      } else {
        await createMember.mutateAsync(formData);
        alert("عضو تیم با موفقیت ایجاد شد");
      }
      router.push("/team-members");
    } catch (error: any) {
      alert(error?.message || "خطا در ذخیره عضو تیم");
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

  const addSpecialty = () => {
    if (specialtyInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, specialtyInput.trim()],
      }));
      setSpecialtyInput("");
    }
  };

  const removeSpecialty = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش عضو تیم" : "افزودن عضو تیم جدید"}
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

        <div className="grid grid-cols-1 gap-5.5 md:grid-cols-2">
          {/* Name */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              نام <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="نام کامل عضو تیم"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          {/* Role */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              نقش <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              placeholder="مثال: مدیر عامل، تحلیلگر ارشد"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              تصویر (URL)
            </label>
            <input
              type="text"
              name="image"
              value={formData.image || ""}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          {/* Education */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              تحصیلات
            </label>
            <input
              type="text"
              name="education"
              value={formData.education || ""}
              onChange={handleChange}
              placeholder="مثال: کارشناسی ارشد مهندسی کامپیوتر"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-5.5 mt-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            توضیحات
          </label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows={4}
            placeholder="توضیحات درباره عضو تیم"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        {/* Specialties */}
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            تخصص‌ها
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={specialtyInput}
              onChange={(e) => setSpecialtyInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialty())}
              placeholder="یک تخصص وارد کنید و Enter بزنید"
              className="flex-1 rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
            <button
              type="button"
              onClick={addSpecialty}
              className="rounded-[7px] bg-primary px-6 py-3 text-white hover:bg-opacity-90"
            >
              افزودن
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.specialties.map((specialty, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-body-sm text-primary"
              >
                {specialty}
                <button
                  type="button"
                  onClick={() => removeSpecialty(index)}
                  className="hover:text-danger"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="mb-5.5 grid grid-cols-1 gap-5.5 md:grid-cols-3">
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              لینکدین
            </label>
            <input
              type="text"
              name="linkedinUrl"
              value={formData.linkedinUrl || ""}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              ایمیل
            </label>
            <input
              type="email"
              name="emailUrl"
              value={formData.emailUrl || ""}
              onChange={handleChange}
              placeholder="email@example.com"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              توییتر
            </label>
            <input
              type="text"
              name="twitterUrl"
              value={formData.twitterUrl || ""}
              onChange={handleChange}
              placeholder="https://twitter.com/..."
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* Order */}
        <div className="mb-5.5">
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
              انتشار عضو تیم
            </span>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={createMember.isPending || updateMember.isPending}
            className="flex justify-center rounded-[7px] bg-primary px-6 py-[7px] font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {isEdit ? "به‌روزرسانی" : "ایجاد"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/team-members")}
            className="flex justify-center rounded-[7px] border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeamMemberForm;
