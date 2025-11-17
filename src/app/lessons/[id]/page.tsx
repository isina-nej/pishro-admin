"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useLesson } from "@/hooks/api/use-lessons";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const ViewLessonPage = () => {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;
  const { data, isLoading, error } = useLesson(lessonId);

  if (isLoading) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="جزئیات درس" />
        <div className="rounded-[10px] border border-stroke bg-white p-7 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
          <p className="text-center">در حال بارگذاری...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (error || !data?.data) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="جزئیات درس" />
        <div className="rounded-[10px] border border-stroke bg-white p-7 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
          <p className="text-danger">خطا در بارگذاری اطلاعات درس</p>
          <button
            onClick={() => router.push("/lessons")}
            className="mt-4 rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
          >
            بازگشت به لیست درس‌ها
          </button>
        </div>
      </DefaultLayout>
    );
  }

  const lesson = data.data;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="جزئیات درس" />

      <div className="flex flex-col gap-10">
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
          <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-dark dark:text-white">
                اطلاعات درس
              </h3>

              <div className="flex gap-3">
                <Link
                  href={`/lessons/edit/${lesson.id}`}
                  className="inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
                >
                  ویرایش درس
                </Link>
                <button
                  onClick={() => router.push("/lessons")}
                  className="inline-flex items-center justify-center rounded bg-gray px-4 py-2 text-center font-medium text-dark hover:bg-opacity-90"
                >
                  بازگشت
                </button>
              </div>
            </div>
          </div>

          <div className="p-7">
            {/* Thumbnail */}
            {lesson.thumbnail && (
              <div className="mb-7">
                <div className="relative h-64 w-full overflow-hidden rounded-lg">
                  <Image
                    src={lesson.thumbnail}
                    alt={lesson.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                  عنوان درس
                </label>
                <p className="text-dark dark:text-white">{lesson.title}</p>
              </div>

              <div>
                <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                  دوره
                </label>
                <Link
                  href={`/courses/${lesson.course.id}`}
                  className="text-primary hover:underline"
                >
                  {lesson.course.subject}
                </Link>
              </div>

              <div>
                <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                  مدت زمان
                </label>
                <p className="text-dark dark:text-white">
                  {lesson.duration || "-"}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                  ترتیب نمایش
                </label>
                <p className="text-dark dark:text-white">{lesson.order}</p>
              </div>

              <div>
                <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                  تعداد بازدید
                </label>
                <p className="text-dark dark:text-white">
                  {lesson.views.toLocaleString("fa-IR")}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                  وضعیت انتشار
                </label>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-body-sm font-medium ${
                    lesson.published
                      ? "bg-[#219653]/[0.08] text-[#219653]"
                      : "bg-[#D34053]/[0.08] text-[#D34053]"
                  }`}
                >
                  {lesson.published ? "منتشر شده" : "پیش‌نویس"}
                </span>
              </div>
            </div>

            {/* Description */}
            {lesson.description && (
              <div className="mb-7">
                <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                  توضیحات
                </label>
                <p className="text-dark dark:text-white whitespace-pre-wrap">
                  {lesson.description}
                </p>
              </div>
            )}

            {/* Video URL */}
            <div className="mb-7">
              <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                URL ویدیو
              </label>
              <a
                href={lesson.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {lesson.videoUrl}
              </a>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 gap-5 border-t border-stroke pt-5 dark:border-dark-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                  تاریخ ایجاد
                </label>
                <p className="text-dark dark:text-white">
                  {new Date(lesson.createdAt).toLocaleDateString("fa-IR")}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                  آخرین به‌روزرسانی
                </label>
                <p className="text-dark dark:text-white">
                  {new Date(lesson.updatedAt).toLocaleDateString("fa-IR")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ViewLessonPage;
