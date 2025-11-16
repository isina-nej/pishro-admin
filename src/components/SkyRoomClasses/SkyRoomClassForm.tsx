"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateSkyRoomClass,
  useUpdateSkyRoomClass,
  useSkyRoomClass,
} from "@/hooks/api/use-skyroom-classes";
import { toast } from "sonner";
import type { CreateSkyRoomClassRequest } from "@/types/api";

interface SkyRoomClassFormProps {
  classId?: string;
  isEdit?: boolean;
}

const SkyRoomClassForm: React.FC<SkyRoomClassFormProps> = ({
  classId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createSkyRoomClass = useCreateSkyRoomClass();
  const updateSkyRoomClass = useUpdateSkyRoomClass();
  const { data: classData } = useSkyRoomClass(classId || "");

  const [formData, setFormData] = useState<CreateSkyRoomClassRequest>({
    title: "",
    description: null,
    instructor: null,
    startDate: null,
    endDate: null,
    meetingLink: "",
    thumbnail: null,
    duration: null,
    capacity: null,
    level: null,
    order: 0,
    published: true,
  });

  useEffect(() => {
    if (isEdit && classData) {
      const skyClass = classData;
      setFormData({
        title: skyClass.title,
        description: skyClass.description || null,
        instructor: skyClass.instructor || null,
        startDate: skyClass.startDate || null,
        endDate: skyClass.endDate || null,
        meetingLink: skyClass.meetingLink,
        thumbnail: skyClass.thumbnail || null,
        duration: skyClass.duration || null,
        capacity: skyClass.capacity || null,
        level: skyClass.level || null,
        order: skyClass.order || 0,
        published: skyClass.published,
      });
    }
  }, [isEdit, classData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && classId) {
        await updateSkyRoomClass.mutateAsync({ id: classId, data: formData });
        toast.success("کلاس با موفقیت به‌روزرسانی شد");
      } else {
        await createSkyRoomClass.mutateAsync(formData);
        toast.success("کلاس با موفقیت ایجاد شد");
      }

      router.push("/skyroom-classes");
    } catch (error: any) {
      toast.error(error?.message || "خطا در ذخیره کلاس");
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
              ? null
              : Number(value)
            : type === "datetime-local"
              ? value
                ? new Date(value)
                : null
              : value || null,
    }));
  };

  const formatDateTimeLocal = (date: Date | string | null | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش کلاس Skyroom" : "افزودن کلاس Skyroom جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        {/* Title and Instructor */}
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان کلاس <span className="text-red">*</span>
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

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              نام مدرس
            </label>
            <input
              type="text"
              name="instructor"
              value={formData.instructor || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
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
            rows={4}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        {/* Meeting Link */}
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            لینک کلاس Skyroom <span className="text-red">*</span>
          </label>
          <input
            type="url"
            name="meetingLink"
            value={formData.meetingLink}
            onChange={handleChange}
            required
            placeholder="https://www.skyroom.online/..."
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        {/* Start Date and End Date */}
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              تاریخ شروع
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={formatDateTimeLocal(formData.startDate)}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              تاریخ پایان
            </label>
            <input
              type="datetime-local"
              name="endDate"
              value={formatDateTimeLocal(formData.endDate)}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* Duration, Capacity, and Level */}
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              مدت زمان (مثال: 2 ساعت)
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration || ""}
              onChange={handleChange}
              placeholder="2 ساعت"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              ظرفیت کلاس
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity || ""}
              onChange={handleChange}
              min="1"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              سطح کلاس
            </label>
            <select
              name="level"
              value={formData.level || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="">انتخاب کنید...</option>
              <option value="مبتدی">مبتدی</option>
              <option value="متوسط">متوسط</option>
              <option value="پیشرفته">پیشرفته</option>
            </select>
          </div>
        </div>

        {/* Thumbnail */}
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            تصویر شاخص (URL)
          </label>
          <input
            type="url"
            name="thumbnail"
            value={formData.thumbnail || ""}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        {/* Order and Published */}
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              ترتیب نمایش
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="0"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              وضعیت انتشار
            </label>
            <div className="flex items-center gap-3 pt-3">
              <label className="flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`mr-3 flex h-5 w-5 items-center justify-center rounded border ${
                    formData.published
                      ? "border-primary bg-primary"
                      : "border-stroke dark:border-dark-3"
                  }`}
                >
                  <span
                    className={`${formData.published ? "opacity-100" : "opacity-0"}`}
                  >
                    <svg
                      width="11"
                      height="8"
                      viewBox="0 0 11 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                        fill="white"
                        stroke="white"
                        strokeWidth="0.4"
                      />
                    </svg>
                  </span>
                </div>
                <span className="text-dark dark:text-white">منتشر شود</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/skyroom-classes")}
            className="rounded bg-gray px-6 py-2 text-dark hover:bg-opacity-90 dark:bg-dark-2 dark:text-white"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={
              createSkyRoomClass.isPending || updateSkyRoomClass.isPending
            }
            className="rounded bg-primary px-6 py-2 text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createSkyRoomClass.isPending || updateSkyRoomClass.isPending
              ? "در حال ذخیره..."
              : isEdit
                ? "به‌روزرسانی"
                : "ایجاد کلاس"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SkyRoomClassForm;
