"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateNewsComment,
  useUpdateNewsComment,
  useNewsComment,
} from "@/hooks/api/use-news-comments";
import { toast } from "sonner";
import { useNews } from "@/hooks/api/use-news";
import { useUsers } from "@/hooks/api/use-users";
import type { CreateNewsCommentRequest } from "@/types/api";

interface NewsCommentFormProps {
  commentId?: string;
  isEdit?: boolean;
}

const NewsCommentForm: React.FC<NewsCommentFormProps> = ({
  commentId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createNewsComment = useCreateNewsComment();
  const updateNewsComment = useUpdateNewsComment();
  const { data: commentData } = useNewsComment(commentId || "");
  const { data: newsData } = useNews({ limit: 100 });
  const { data: usersData } = useUsers({ limit: 100 });

  const [formData, setFormData] = useState<CreateNewsCommentRequest>({
    content: "",
    articleId: undefined,
    userId: undefined,
  });

  useEffect(() => {
    if (isEdit && commentData) {
      const comment = commentData;
      setFormData({
        content: comment.content,
        articleId: comment.articleId || undefined,
        userId: comment.userId || undefined,
      });
    }
  }, [isEdit, commentData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.content) {
      toast.error("محتوای نظر الزامی است");
      return;
    }

    if (!formData.articleId) {
      toast.error("انتخاب خبر الزامی است");
      return;
    }

    try {
      if (isEdit && commentId) {
        await updateNewsComment.mutateAsync({ id: commentId, data: formData });
        toast.success("نظر با موفقیت به‌روزرسانی شد");
      } else {
        await createNewsComment.mutateAsync(formData);
        toast.success("نظر با موفقیت ایجاد شد");
      }
      router.push("/news-comments");
    } catch (error: any) {
      toast.error(error?.message || "خطا در ذخیره نظر");
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش نظر خبری" : "افزودن نظر خبری جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            خبر <span className="text-red">*</span>
          </label>
          <select
            name="articleId"
            value={formData.articleId || ""}
            onChange={handleChange}
            required
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            <option value="">انتخاب کنید...</option>
            {newsData?.items?.map((article: any) => (
              <option key={article.id} value={article.id}>
                {article.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            کاربر (اختیاری)
          </label>
          <select
            name="userId"
            value={formData.userId || ""}
            onChange={handleChange}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            <option value="">انتخاب کنید...</option>
            {usersData?.items?.map((user: any) => (
              <option key={user.id} value={user.id}>
                {user.firstName
                  ? `${user.firstName} ${user.lastName || ""} (${user.phoneNumber})`
                  : user.phoneNumber}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            محتوای نظر <span className="text-red">*</span>
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={6}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        {isEdit && commentData && (
          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              تعداد لایک‌ها (فقط مشاهده)
            </label>
            <input
              type="text"
              value={commentData.likes?.length || 0}
              disabled
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-gray px-5.5 py-3 text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
            <p className="mt-1 text-body-sm text-body-color">
              لایک‌ها توسط کاربران در سمت کاربر اضافه می‌شوند
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/news-comments")}
            className="rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={createNewsComment.isPending || updateNewsComment.isPending}
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createNewsComment.isPending || updateNewsComment.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsCommentForm;
