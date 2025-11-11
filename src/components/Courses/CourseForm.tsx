"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import {
  useCreateCourse,
  useUpdateCourse,
  useCourse,
} from "@/hooks/api/use-courses";

import { useCategories } from "@/hooks/api/use-categories";

import type { CreateCourseRequest } from "@/types/api";

interface CourseFormProps {
  courseId?: string;

  isEdit?: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({
  courseId,
  isEdit = false,
}) => {
  const router = useRouter();

  const createCourse = useCreateCourse();

  const updateCourse = useUpdateCourse();

  const { data: courseData } = useCourse(courseId || "");

  const { data: categoriesData } = useCategories({ limit: 100 });

  const [formData, setFormData] = useState<CreateCourseRequest>({
    subject: "",

    slug: "",

    description: "",

    price: 0,

    discountPercent: 0,

    img: "",

    rating: null,

    time: "",

    students: null,

    videosCount: null,

    level: "BEGINNER",

    language: "FA",

    prerequisites: [],

    learningGoals: [],

    instructor: null,

    status: "ACTIVE",

    published: false,

    featured: false,

    views: 0,

    categoryId: undefined,

    tagIds: [],
  });

  useEffect(() => {
    if (isEdit && courseData) {
      const course = courseData;

      setFormData({
        subject: course.subject,

        slug: course.slug || "",

        description: course.description || "",

        price: course.price,

        discountPercent: course.discountPercent || 0,

        img: course.img || "",

        rating: course.rating || null,

        time: course.time || "",

        students: course.students || null,

        videosCount: course.videosCount || null,

        level: course.level || "BEGINNER",

        language: course.language,

        prerequisites: course.prerequisites || [],

        learningGoals: course.learningGoals || [],

        instructor: course.instructor || null,

        status: course.status,

        published: course.published,

        featured: course.featured,

        views: course.views || 0,

        categoryId: course.categoryId || undefined,

        tagIds: course.tagIds || [],
      });
    }
  }, [isEdit, courseData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && courseId) {
        await updateCourse.mutateAsync({ id: courseId, data: formData });

        alert("دوره با موفقیت به‌روزرسانی شد");
      } else {
        await createCourse.mutateAsync(formData);

        alert("دوره با موفقیت ایجاد شد");
      }

      router.push("/courses");
    } catch (error: any) {
      alert(error?.message || "خطا در ذخیره دوره");

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
            : value,
    }));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش دوره" : "افزودن دوره جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              عنوان دوره <span className="text-red">*</span>
            </label>

            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              Slug <span className="text-red">*</span>
            </label>

            <input
              type="text"
              name="slug"
              value={formData.slug || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            توضیحات
          </label>

          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows={6}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              قیمت (تومان) <span className="text-red">*</span>
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              درصد تخفیف
            </label>

            <input
              type="number"
              name="discountPercent"
              value={formData.discountPercent || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              دسته‌بندی
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
              سطح دوره
            </label>

            <select
              name="level"
              value={formData.level || "BEGINNER"}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="BEGINNER">مبتدی</option>

              <option value="INTERMEDIATE">متوسط</option>

              <option value="ADVANCED">پیشرفته</option>
            </select>
          </div>
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              مدت زمان
            </label>

            <input
              type="text"
              name="time"
              value={formData.time || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              وضعیت
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="ACTIVE">فعال</option>

              <option value="INACTIVE">غیرفعال</option>
            </select>
          </div>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            URL تصویر
          </label>

          <input
            type="text"
            name="img"
            value={formData.img || ""}
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
            onClick={() => router.push("/courses")}
            className="rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={createCourse.isPending || updateCourse.isPending}
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createCourse.isPending || updateCourse.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
