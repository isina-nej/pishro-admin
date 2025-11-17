"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import {
  useCreateQuiz,
  useUpdateQuiz,
  useQuiz,
} from "@/hooks/api/use-quizzes";
import { toast } from "sonner";

import { useCategories } from "@/hooks/api/use-categories";
import { useCourses } from "@/hooks/api/use-courses";

import type { CreateQuizRequest } from "@/types/api";

interface QuizFormProps {
  quizId?: string;

  isEdit?: boolean;
}

const QuizForm: React.FC<QuizFormProps> = ({
  quizId,
  isEdit = false,
}) => {
  const router = useRouter();

  const createQuiz = useCreateQuiz();

  const updateQuiz = useUpdateQuiz();

  const { data: quizData } = useQuiz(quizId || "");

  const { data: categoriesData } = useCategories({ limit: 100 });

  const { data: coursesData } = useCourses({ limit: 100 });

  const [formData, setFormData] = useState<CreateQuizRequest>({
    title: "",

    description: "",

    courseId: undefined,

    categoryId: undefined,

    timeLimit: null,

    passingScore: 70,

    maxAttempts: null,

    shuffleQuestions: false,

    shuffleAnswers: false,

    showResults: true,

    showCorrectAnswers: true,

    published: false,

    order: 0,
  });

  useEffect(() => {
    if (isEdit && quizData) {
      const quiz = quizData;

      setFormData({
        title: quiz.title,

        description: quiz.description || "",

        courseId: quiz.courseId || undefined,

        categoryId: quiz.categoryId || undefined,

        timeLimit: quiz.timeLimit || null,

        passingScore: quiz.passingScore,

        maxAttempts: quiz.maxAttempts || null,

        shuffleQuestions: quiz.shuffleQuestions,

        shuffleAnswers: quiz.shuffleAnswers,

        showResults: quiz.showResults,

        showCorrectAnswers: quiz.showCorrectAnswers,

        published: quiz.published,

        order: quiz.order,
      });
    }
  }, [isEdit, quizData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && quizId) {
        await updateQuiz.mutateAsync({ id: quizId, data: formData });

        toast.success("آزمون با موفقیت به‌روزرسانی شد");
      } else {
        await createQuiz.mutateAsync(formData);

        toast.success("آزمون با موفقیت ایجاد شد");
      }

      router.push("/quizzes");
    } catch (error: any) {
      toast.error(error?.message || "خطا در ذخیره آزمون");

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
            : value,
    }));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش آزمون" : "افزودن آزمون جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            عنوان آزمون <span className="text-red">*</span>
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

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              محدودیت زمان (دقیقه)
            </label>

            <input
              type="number"
              name="timeLimit"
              value={formData.timeLimit || ""}
              onChange={handleChange}
              placeholder="نامحدود"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              نمره قبولی (درصد) <span className="text-red">*</span>
            </label>

            <input
              type="number"
              name="passingScore"
              value={formData.passingScore}
              onChange={handleChange}
              required
              min="0"
              max="100"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              حداکثر تلاش
            </label>

            <input
              type="number"
              name="maxAttempts"
              value={formData.maxAttempts || ""}
              onChange={handleChange}
              placeholder="نامحدود"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            ترتیب نمایش
          </label>

          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            تنظیمات آزمون
          </label>

          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                name="shuffleQuestions"
                checked={formData.shuffleQuestions}
                onChange={handleChange}
                className="rounded border-stroke"
              />

              <span className="text-body-sm font-medium text-dark dark:text-white">
                ترتیب تصادفی سوالات
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                name="shuffleAnswers"
                checked={formData.shuffleAnswers}
                onChange={handleChange}
                className="rounded border-stroke"
              />

              <span className="text-body-sm font-medium text-dark dark:text-white">
                ترتیب تصادفی گزینه‌ها
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                name="showResults"
                checked={formData.showResults}
                onChange={handleChange}
                className="rounded border-stroke"
              />

              <span className="text-body-sm font-medium text-dark dark:text-white">
                نمایش نتایج پس از اتمام
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                name="showCorrectAnswers"
                checked={formData.showCorrectAnswers}
                onChange={handleChange}
                className="rounded border-stroke"
              />

              <span className="text-body-sm font-medium text-dark dark:text-white">
                نمایش پاسخ‌های صحیح پس از اتمام
              </span>
            </label>

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
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/quizzes")}
            className="rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={createQuiz.isPending || updateQuiz.isPending}
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createQuiz.isPending || updateQuiz.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizForm;
