"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateEnrollment,
  useUpdateEnrollment,
  useEnrollment,
} from "@/hooks/api/use-enrollments";
import { useUsers } from "@/hooks/api/use-users";
import { useCourses } from "@/hooks/api/use-courses";
import type { CreateEnrollmentRequest, UpdateEnrollmentRequest } from "@/types/api";

interface EnrollmentFormProps {
  enrollmentId?: string;
  isEdit?: boolean;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({
  enrollmentId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createEnrollment = useCreateEnrollment();
  const updateEnrollment = useUpdateEnrollment();
  const { data: enrollmentData } = useEnrollment(enrollmentId || "");
  const { data: usersData } = useUsers({ limit: 100 });
  const { data: coursesData } = useCourses({ limit: 100 });

  const [formData, setFormData] = useState<
    CreateEnrollmentRequest | UpdateEnrollmentRequest
  >({
    userId: "",
    courseId: "",
    progress: 0,
  });

  const [completedDate, setCompletedDate] = useState<string>("");

  useEffect(() => {
    if (isEdit && enrollmentData) {
      const enrollment = enrollmentData;
      setFormData({
        progress: enrollment.progress || 0,
        completedAt: enrollment.completedAt || undefined,
        lastAccessAt: enrollment.lastAccessAt || undefined,
      });
      if (enrollment.completedAt) {
        setCompletedDate(
          new Date(enrollment.completedAt).toISOString().split("T")[0],
        );
      }
    }
  }, [isEdit, enrollmentData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && enrollmentId) {
        const updateData: UpdateEnrollmentRequest = {
          progress: formData.progress,
          completedAt: completedDate ? new Date(completedDate) : undefined,
          lastAccessAt: new Date(),
        };
        await updateEnrollment.mutateAsync({ id: enrollmentId, data: updateData });
        alert("ثبت‌نام با موفقیت به‌روزرسانی شد");
      } else {
        await createEnrollment.mutateAsync(formData as CreateEnrollmentRequest);
        alert("ثبت‌نام با موفقیت ایجاد شد");
      }
      router.push("/enrollments");
    } catch (error: any) {
      alert(error?.message || "خطا در ذخیره ثبت‌نام");
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش ثبت‌نام" : "افزودن ثبت‌نام جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        {!isEdit ? (
          <>
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  کاربر <span className="text-red">*</span>
                </label>
                <select
                  name="userId"
                  value={(formData as CreateEnrollmentRequest).userId || ""}
                  onChange={handleChange}
                  required
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                >
                  <option value="">انتخاب کنید...</option>
                  {usersData?.items?.map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} - {user.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-1/2">
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  دوره <span className="text-red">*</span>
                </label>
                <select
                  name="courseId"
                  value={(formData as CreateEnrollmentRequest).courseId || ""}
                  onChange={handleChange}
                  required
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                >
                  <option value="">انتخاب کنید...</option>
                  {coursesData?.items?.map((course: any) => (
                    <option key={course.id} value={course.id}>
                      {course.subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        ) : (
          <div className="mb-5.5 rounded-[7px] border border-stroke bg-gray-2 p-5 dark:border-dark-3 dark:bg-dark-3">
            <h4 className="mb-3 font-medium text-dark dark:text-white">
              اطلاعات ثبت‌نام (فقط خواندنی)
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-body-sm text-body">کاربر:</p>
                <p className="font-medium text-dark dark:text-white">
                  {enrollmentData?.user.firstName} {enrollmentData?.user.lastName}
                </p>
              </div>
              <div>
                <p className="text-body-sm text-body">دوره:</p>
                <p className="font-medium text-dark dark:text-white">
                  {enrollmentData?.course.subject}
                </p>
              </div>
              <div>
                <p className="text-body-sm text-body">تاریخ ثبت‌نام:</p>
                <p className="font-medium text-dark dark:text-white">
                  {enrollmentData?.enrolledAt &&
                    new Date(enrollmentData.enrolledAt).toLocaleDateString(
                      "fa-IR",
                    )}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            پیشرفت (0-100) <span className="text-red">*</span>
          </label>
          <input
            type="number"
            name="progress"
            value={formData.progress || 0}
            onChange={handleChange}
            required
            min="0"
            max="100"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
          <div className="mt-2 h-3 w-full rounded-full bg-gray">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${formData.progress || 0}%` }}
            />
          </div>
        </div>

        {isEdit && (
          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              تاریخ تکمیل (اختیاری)
            </label>
            <input
              type="date"
              value={completedDate}
              onChange={(e) => setCompletedDate(e.target.value)}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
            <p className="mt-2 text-body-sm text-body">
              اگر دوره تکمیل شده است، تاریخ تکمیل را وارد کنید
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/enrollments")}
            className="rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={createEnrollment.isPending || updateEnrollment.isPending}
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createEnrollment.isPending || updateEnrollment.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnrollmentForm;
