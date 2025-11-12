"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useComment } from "@/hooks/api/use-comments";

const CommentDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  const { data: comment, isLoading, error } = useComment(id);

  if (isLoading) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="جزئیات نظر" />
        <div className="rounded-[10px] border border-stroke bg-white p-7">
          <p>در حال بارگذاری...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (error || !comment) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="جزئیات نظر" />
        <div className="rounded-[10px] border border-stroke bg-white p-7">
          <p className="text-danger">خطا در بارگذاری نظر</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="جزئیات نظر" />

      <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-dark dark:text-white">
              اطلاعات نظر
            </h3>
            <Link
              href={`/comments/edit/${comment.id}`}
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
                {comment.userName || comment.user?.firstName || "-"}
              </p>
            </div>

            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                دوره
              </label>
              <p className="text-dark dark:text-white">
                {comment.course?.subject || "-"}
              </p>
            </div>

            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                امتیاز
              </label>
              <p className="text-dark dark:text-white">
                {comment.rating ? `${comment.rating}/5` : "-"}
              </p>
            </div>

            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                وضعیت
              </label>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-body-sm font-medium ${comment.published ? "bg-[#219653]/[0.08] text-[#219653]" : "bg-[#FFA70B]/[0.08] text-[#FFA70B]"}`}
              >
                {comment.published ? "منتشر شده" : "در انتظار"}
              </span>
            </div>

            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                تایید شده
              </label>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-body-sm font-medium ${comment.verified ? "bg-[#219653]/[0.08] text-[#219653]" : "bg-gray/[0.08] text-body"}`}
              >
                {comment.verified ? "بله" : "خیر"}
              </span>
            </div>

            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                ویژه
              </label>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-body-sm font-medium ${comment.featured ? "bg-[#219653]/[0.08] text-[#219653]" : "bg-gray/[0.08] text-body"}`}
              >
                {comment.featured ? "بله" : "خیر"}
              </span>
            </div>

            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                تعداد لایک‌ها
              </label>
              <p className="text-dark dark:text-white">
                {comment.likes?.length || 0}
              </p>
            </div>

            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                تعداد دیسلایک‌ها
              </label>
              <p className="text-dark dark:text-white">
                {comment.dislikes?.length || 0}
              </p>
            </div>

            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                تعداد بازدید
              </label>
              <p className="text-dark dark:text-white">{comment.views || 0}</p>
            </div>

            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                تاریخ ایجاد
              </label>
              <p className="text-dark dark:text-white">
                {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
              </p>
            </div>
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              متن نظر
            </label>
            <div className="rounded-[7px] border-[1.5px] border-stroke bg-gray-2 px-5.5 py-3 text-dark dark:border-dark-3 dark:bg-dark-3 dark:text-white">
              {comment.text}
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              href="/comments"
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

export default CommentDetailPage;
