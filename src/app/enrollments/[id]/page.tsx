"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useEnrollment } from "@/hooks/api/use-enrollments";

const EnrollmentDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  const { data: enrollment, isLoading, error } = useEnrollment(id);

  if (isLoading) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="جزئیات ثبت‌نام" />
        <div className="rounded-[10px] border border-stroke bg-white p-7">
          <p>در حال بارگذاری...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (error || !enrollment) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="جزئیات ثبت‌نام" />
        <div className="rounded-[10px] border border-stroke bg-white p-7">
          <p className="text-danger">خطا در بارگذاری ثبت‌نام</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="جزئیات ثبت‌نام" />

      <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-dark dark:text-white">
              اطلاعات ثبت‌نام
            </h3>
            <Link
              href={`/enrollments/edit/${enrollment.id}`}
              className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
            >
              <svg
                className="fill-current"
                width="16"
                height="16"
                viewBox="0 0 20 20"
              >
                <path d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z" />
                <path d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z" />
              </svg>
              ویرایش
            </Link>
          </div>
        </div>

        <div className="p-7">
          <div className="mb-5.5 grid grid-cols-1 gap-5.5 sm:grid-cols-2">
            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                کاربر
              </label>
              <p className="text-dark dark:text-white">
                {enrollment.user.firstName} {enrollment.user.lastName}
              </p>
              {enrollment.user.phone && (
                <p className="text-body text-body-sm">{enrollment.user.phone}</p>
              )}
              {enrollment.user.email && (
                <p className="text-body text-body-sm">{enrollment.user.email}</p>
              )}
            </div>

            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                دوره
              </label>
              <p className="font-medium text-dark dark:text-white">
                {enrollment.course.subject}
              </p>
              {enrollment.course.price && (
                <p className="text-body text-body-sm">
                  قیمت: {enrollment.course.price.toLocaleString("fa-IR")} تومان
                </p>
              )}
            </div>

            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                پیشرفت
              </label>
              <div className="flex items-center gap-3">
                <div className="h-3 w-40 rounded-full bg-gray">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
                <span className="font-medium text-dark dark:text-white">
                  {enrollment.progress}%
                </span>
              </div>
            </div>

            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                وضعیت
              </label>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-body-sm font-medium ${
                  enrollment.completedAt
                    ? "bg-[#219653]/[0.08] text-[#219653]"
                    : "bg-[#FFA70B]/[0.08] text-[#FFA70B]"
                }`}
              >
                {enrollment.completedAt ? "تکمیل شده" : "در حال یادگیری"}
              </span>
            </div>

            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                تاریخ ثبت‌نام
              </label>
              <p className="text-dark dark:text-white">
                {new Date(enrollment.enrolledAt).toLocaleDateString("fa-IR")}
              </p>
            </div>

            {enrollment.completedAt && (
              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  تاریخ تکمیل
                </label>
                <p className="text-dark dark:text-white">
                  {new Date(enrollment.completedAt).toLocaleDateString("fa-IR")}
                </p>
              </div>
            )}

            {enrollment.lastAccessAt && (
              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  آخرین دسترسی
                </label>
                <p className="text-dark dark:text-white">
                  {new Date(enrollment.lastAccessAt).toLocaleDateString("fa-IR")}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Link
              href="/enrollments"
              className="inline-flex items-center gap-2 rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
            >
              بازگشت
            </Link>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EnrollmentDetailPage;
