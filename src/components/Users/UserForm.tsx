"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateUser, useUpdateUser, useUser } from "@/hooks/api/use-users";
import type { CreateUserRequest } from "@/types/api";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";

interface UserFormProps {
  userId?: string;
  isEdit?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ userId, isEdit = false }) => {
  const router = useRouter();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const { data: userData } = useUser(userId || "");

  const [formData, setFormData] = useState<CreateUserRequest>({
    phone: "",
    password: "",
    phoneVerified: false,
    role: "USER",
    firstName: "",
    lastName: "",
    email: "",
    nationalCode: "",
    birthDate: null,
    avatarUrl: "",
    cardNumber: "",
    shebaNumber: "",
    accountOwner: "",
  });

  useEffect(() => {
    if (isEdit && userData) {
      const user = userData.data;
      setFormData({
        phone: user.phone,
        password: "", // We don't populate password for security
        phoneVerified: user.phoneVerified,
        role: user.role,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        nationalCode: user.nationalCode || "",
        birthDate: user.birthDate || null,
        avatarUrl: user.avatarUrl || "",
        cardNumber: user.cardNumber || "",
        shebaNumber: user.shebaNumber || "",
        accountOwner: user.accountOwner || "",
      });
    }
  }, [isEdit, userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && userId) {
        // For edit, don't send password if it's empty
        const { password, ...restData } = formData;
        const updateData = password ? formData : restData;
        await updateUser.mutateAsync({ id: userId, data: updateData });
        toast.success("کاربر با موفقیت به‌روزرسانی شد");
      } else {
        await createUser.mutateAsync(formData);
        toast.success("کاربر با موفقیت ایجاد شد");
      }
      router.push("/users");
    } catch (error: any) {
      toast.error(error?.message || "خطا در ذخیره کاربر");
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
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش کاربر" : "افزودن کاربر جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        {/* Account Information */}
        <div className="mb-5.5">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            اطلاعات حساب کاربری
          </h4>
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              شماره تلفن <span className="text-red">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={isEdit}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:disabled:bg-dark-3"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              رمز عبور {!isEdit && <span className="text-red">*</span>}
              {isEdit && (
                <span className="text-body-xs text-gray-5">
                  {" "}
                  (خالی بگذارید اگر نمی‌خواهید تغییر دهید)
                </span>
              )}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEdit}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              نقش کاربر
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="USER">کاربر عادی</option>
              <option value="ADMIN">ادمین</option>
            </select>
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              ایمیل
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* Personal Information */}
        <div className="mb-5.5 mt-7">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            اطلاعات شخصی
          </h4>
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              نام
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              نام خانوادگی
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              کد ملی
            </label>
            <input
              type="text"
              name="nationalCode"
              value={formData.nationalCode || ""}
              onChange={handleChange}
              maxLength={10}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              تاریخ تولد
            </label>
            <input
              type="date"
              name="birthDate"
              value={
                formData.birthDate
                  ? new Date(formData.birthDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5">
          <ImageUpload
            label="تصویر پروفایل"
            name="avatarUrl"
            value={formData.avatarUrl || ""}
            onChange={(url) => setFormData((prev) => ({ ...prev, avatarUrl: url }))}
            category="PROFILE"
            showPreview={true}
            previewWidth={150}
            previewHeight={150}
            alt="تصویر پروفایل کاربر"
          />
        </div>

        {/* Payment Information */}
        <div className="mb-5.5 mt-7">
          <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            اطلاعات پرداخت
          </h4>
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              شماره کارت
            </label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber || ""}
              onChange={handleChange}
              maxLength={16}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              شماره شبا
            </label>
            <input
              type="text"
              name="shebaNumber"
              value={formData.shebaNumber || ""}
              onChange={handleChange}
              maxLength={24}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            نام صاحب حساب
          </label>
          <input
            type="text"
            name="accountOwner"
            value={formData.accountOwner || ""}
            onChange={handleChange}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        {/* Status */}
        <div className="mb-5.5 flex gap-5">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name="phoneVerified"
              checked={formData.phoneVerified}
              onChange={handleChange}
              className="rounded border-stroke"
            />
            <span className="text-body-sm font-medium text-dark dark:text-white">
              شماره تلفن تایید شده
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/users")}
            className="rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={createUser.isPending || updateUser.isPending}
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createUser.isPending || updateUser.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
