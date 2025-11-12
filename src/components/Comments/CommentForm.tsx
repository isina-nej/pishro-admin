"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateComment,
  useUpdateComment,
  useComment,
} from "@/hooks/api/use-comments";
import { useCourses } from "@/hooks/api/use-courses";
import { useCategories } from "@/hooks/api/use-categories";
import type { CreateCommentRequest } from "@/types/api";

interface CommentFormProps {
  commentId?: string;
  isEdit?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  commentId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createComment = useCreateComment();
  const updateComment = useUpdateComment();
  const { data: commentData } = useComment(commentId || "");
  const { data: coursesData } = useCourses({ limit: 100 });
  const { data: categoriesData } = useCategories({ limit: 100 });

  const [formData, setFormData] = useState<CreateCommentRequest>({
    text: "",
    rating: null,
    userName: null,
    userAvatar: null,
    userRole: null,
    userCompany: null,
    published: false,
    verified: false,
    featured: false,
    userId: undefined,
    courseId: undefined,
    categoryId: undefined,
  });

  useEffect(() => {
    if (isEdit && commentData) {
      const comment = commentData;
      setFormData({
        text: comment.text,
        rating: comment.rating || null,
        userName: comment.userName || null,
        userAvatar: comment.userAvatar || null,
        userRole: comment.userRole || null,
        userCompany: comment.userCompany || null,
        published: comment.published,
        verified: comment.verified,
        featured: comment.featured,
        userId: comment.userId || undefined,
        courseId: comment.courseId || undefined,
        categoryId: comment.categoryId || undefined,
      });
    }
  }, [isEdit, commentData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && commentId) {
        await updateComment.mutateAsync({ id: commentId, data: formData });
        alert("نظر با موفقیت به‌روزرسانی شد");
      } else {
        await createComment.mutateAsync(formData);
        alert("نظر با موفقیت ایجاد شد");
      }
      router.push("/comments");
    } catch (error: any) {
      alert(error?.message || "خطا در ذخیره نظر");
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
            ? value === "" ? null : Number(value)
            : value === "" ? null : value,
    }));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش نظر" : "افزودن نظر جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            متن نظر <span className="text-red">*</span>
          </label>
          <textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
            required
            rows={6}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              امتیاز (1-5)
            </label>
            <input
              type="number"
              name="rating"
              value={formData.rating || ""}
              onChange={handleChange}
              min="1"
              max="5"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              نام کاربر (برای نظرات بدون حساب کاربری)
            </label>
            <input
              type="text"
              name="userName"
              value={formData.userName || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              نقش کاربر
            </label>
            <input
              type="text"
              name="userRole"
              value={formData.userRole || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              شرکت/سازمان
            </label>
            <input
              type="text"
              name="userCompany"
              value={formData.userCompany || ""}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            آواتار کاربر (URL)
          </label>
          <input
            type="text"
            name="userAvatar"
            value={formData.userAvatar || ""}
            onChange={handleChange}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              دوره
            </label>
            <select
              name="courseId"
              value={formData.courseId || ""}
              onChange={handleChange}
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
              name="verified"
              checked={formData.verified}
              onChange={handleChange}
              className="rounded border-stroke"
            />
            <span className="text-body-sm font-medium text-dark dark:text-white">
              تایید شده
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
            onClick={() => router.push("/comments")}
            className="rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={createComment.isPending || updateComment.isPending}
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createComment.isPending || updateComment.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
