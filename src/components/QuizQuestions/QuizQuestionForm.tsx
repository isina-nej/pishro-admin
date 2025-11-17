"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCreateQuizQuestion,
  useUpdateQuizQuestion,
  useQuizQuestion,
} from "@/hooks/api/use-quiz-questions";
import { toast } from "sonner";
import type { CreateQuizQuestionRequest } from "@/types/api";
import type { QuestionType } from "@prisma/client";

interface QuizQuestionFormProps {
  questionId?: string;
  isEdit?: boolean;
}

interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

const QuizQuestionForm: React.FC<QuizQuestionFormProps> = ({
  questionId,
  isEdit = false,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizIdFromUrl = searchParams.get("quizId");

  const createQuizQuestion = useCreateQuizQuestion();
  const updateQuizQuestion = useUpdateQuizQuestion();
  const { data: questionData } = useQuizQuestion(questionId || "");

  const [formData, setFormData] = useState<CreateQuizQuestionRequest>({
    quizId: quizIdFromUrl || "",
    question: "",
    questionType: "MULTIPLE_CHOICE" as QuestionType,
    options: [],
    correctAnswer: null,
    explanation: "",
    points: 1,
    order: 0,
  });

  const [options, setOptions] = useState<QuestionOption[]>([
    { text: "", isCorrect: false },
  ]);

  useEffect(() => {
    if (isEdit && questionData) {
      const question = questionData;
      setFormData({
        quizId: question.quizId,
        question: question.question,
        questionType: question.questionType as QuestionType,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || "",
        points: question.points,
        order: question.order,
      });

      // Parse options if they exist
      if (question.options && Array.isArray(question.options)) {
        setOptions(question.options as QuestionOption[]);
      }
    }
  }, [isEdit, questionData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate based on question type
    if (
      (formData.questionType === "MULTIPLE_CHOICE" ||
        formData.questionType === "MULTIPLE_SELECT") &&
      options.length === 0
    ) {
      toast.error("لطفا حداقل یک گزینه اضافه کنید");
      return;
    }

    if (
      formData.questionType === "MULTIPLE_CHOICE" &&
      options.filter((opt) => opt.isCorrect).length !== 1
    ) {
      toast.error("برای سوال چند گزینه‌ای باید دقیقا یک پاسخ صحیح وجود داشته باشد");
      return;
    }

    if (
      formData.questionType === "MULTIPLE_SELECT" &&
      options.filter((opt) => opt.isCorrect).length === 0
    ) {
      toast.error("لطفا حداقل یک پاسخ صحیح را انتخاب کنید");
      return;
    }

    try {
      const submitData = {
        ...formData,
        options:
          formData.questionType === "MULTIPLE_CHOICE" ||
          formData.questionType === "MULTIPLE_SELECT"
            ? options
            : [],
        correctAnswer:
          formData.questionType === "TRUE_FALSE"
            ? formData.correctAnswer
            : null,
      };

      if (isEdit && questionId) {
        await updateQuizQuestion.mutateAsync({ id: questionId, data: submitData });
        toast.success("سوال با موفقیت به‌روزرسانی شد");
      } else {
        await createQuizQuestion.mutateAsync(submitData);
        toast.success("سوال با موفقیت ایجاد شد");
      }

      router.push(`/quiz-questions?quizId=${formData.quizId}`);
    } catch (error: any) {
      toast.error(error?.message || "خطا در ذخیره سوال");
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
            ? value === ""
              ? 0
              : Number(value)
            : value,
    }));
  };

  const handleQuestionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as QuestionType;
    setFormData((prev) => ({
      ...prev,
      questionType: newType,
    }));

    // Reset options and correctAnswer based on type
    if (newType === "MULTIPLE_CHOICE" || newType === "MULTIPLE_SELECT") {
      setOptions([{ text: "", isCorrect: false }]);
    } else if (newType === "TRUE_FALSE") {
      setFormData((prev) => ({ ...prev, correctAnswer: true }));
    }
  };

  const addOption = () => {
    setOptions([...options, { text: "", isCorrect: false }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, field: keyof QuestionOption, value: string | boolean) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };

    // For MULTIPLE_CHOICE, ensure only one option is correct
    if (
      formData.questionType === "MULTIPLE_CHOICE" &&
      field === "isCorrect" &&
      value === true
    ) {
      newOptions.forEach((opt, i) => {
        if (i !== index) {
          opt.isCorrect = false;
        }
      });
    }

    setOptions(newOptions);
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش سوال" : "افزودن سوال جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            متن سوال <span className="text-red">*</span>
          </label>

          <textarea
            name="question"
            value={formData.question}
            onChange={handleChange}
            required
            rows={3}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            نوع سوال <span className="text-red">*</span>
          </label>

          <select
            name="questionType"
            value={formData.questionType}
            onChange={handleQuestionTypeChange}
            required
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            <option value="MULTIPLE_CHOICE">چند گزینه‌ای (یک جواب صحیح)</option>
            <option value="MULTIPLE_SELECT">چند گزینه‌ای (چند جواب صحیح)</option>
            <option value="TRUE_FALSE">صحیح/غلط</option>
            <option value="SHORT_ANSWER">پاسخ کوتاه</option>
          </select>
        </div>

        {/* Options for MULTIPLE_CHOICE and MULTIPLE_SELECT */}
        {(formData.questionType === "MULTIPLE_CHOICE" ||
          formData.questionType === "MULTIPLE_SELECT") && (
          <div className="mb-5.5">
            <div className="mb-3 flex items-center justify-between">
              <label className="block text-body-sm font-medium text-dark dark:text-white">
                گزینه‌ها <span className="text-red">*</span>
              </label>
              <button
                type="button"
                onClick={addOption}
                className="rounded bg-primary px-3 py-1 text-body-sm text-white hover:bg-opacity-90"
              >
                + افزودن گزینه
              </button>
            </div>

            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) =>
                      updateOption(index, "text", e.target.value)
                    }
                    placeholder={`گزینه ${index + 1}`}
                    required
                    className="flex-1 rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  />

                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type={
                        formData.questionType === "MULTIPLE_CHOICE"
                          ? "radio"
                          : "checkbox"
                      }
                      checked={option.isCorrect}
                      onChange={(e) =>
                        updateOption(index, "isCorrect", e.target.checked)
                      }
                      className="rounded border-stroke"
                    />
                    <span className="text-body-sm text-dark dark:text-white">
                      صحیح
                    </span>
                  </label>

                  {options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="text-danger hover:text-red"
                      title="حذف گزینه"
                    >
                      <svg
                        className="fill-current"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8.59048 1.87502H11.4084C11.5887 1.8749 11.7458 1.8748 11.8941 1.89849C12.4802 1.99208 12.9874 2.35762 13.2615 2.88403C13.3309 3.01727 13.3805 3.16634 13.4374 3.33745L13.5304 3.61654C13.5461 3.66378 13.5506 3.67715 13.5545 3.68768C13.7004 4.09111 14.0787 4.36383 14.5076 4.3747C14.5189 4.37498 14.5327 4.37503 14.5828 4.37503H17.0828C17.4279 4.37503 17.7078 4.65485 17.7078 5.00003C17.7078 5.34521 17.4279 5.62503 17.0828 5.62503H2.91602C2.57084 5.62503 2.29102 5.34521 2.29102 5.00003C2.29102 4.65485 2.57084 4.37503 2.91602 4.37503H5.41609C5.46612 4.37503 5.47993 4.37498 5.49121 4.3747C5.92009 4.36383 6.29844 4.09113 6.44437 3.6877C6.44821 3.67709 6.45262 3.66401 6.46844 3.61654L6.56145 3.33747C6.61836 3.16637 6.66795 3.01728 6.73734 2.88403C7.01146 2.35762 7.51862 1.99208 8.1047 1.89849C8.25305 1.8748 8.41016 1.8749 8.59048 1.87502ZM7.50614 4.37503C7.54907 4.29085 7.5871 4.20337 7.61983 4.1129C7.62977 4.08543 7.63951 4.05619 7.65203 4.01861L7.7352 3.7691C7.81118 3.54118 7.82867 3.49469 7.84602 3.46137C7.9374 3.2859 8.10645 3.16405 8.30181 3.13285C8.33892 3.12693 8.38854 3.12503 8.6288 3.12503H11.37C11.6103 3.12503 11.6599 3.12693 11.697 3.13285C11.8924 3.16405 12.0614 3.2859 12.1528 3.46137C12.1702 3.49469 12.1877 3.54117 12.2636 3.7691L12.3468 4.01846L12.379 4.11292C12.4117 4.20338 12.4498 4.29085 12.4927 4.37503H7.50614Z"
                          fill=""
                        />
                        <path
                          d="M4.92859 7.04179C4.90563 6.69738 4.60781 6.43679 4.2634 6.45975C3.91899 6.48271 3.6584 6.78053 3.68136 7.12494L4.06757 12.9181C4.13881 13.987 4.19636 14.8505 4.33134 15.528C4.47167 16.2324 4.71036 16.8208 5.20335 17.2821C5.69635 17.7433 6.2993 17.9423 7.01151 18.0355C7.69653 18.1251 8.56189 18.125 9.63318 18.125H10.3656C11.4369 18.125 12.3023 18.1251 12.9873 18.0355C13.6995 17.9423 14.3025 17.7433 14.7955 17.2821C15.2885 16.8208 15.5272 16.2324 15.6675 15.528C15.8025 14.8505 15.86 13.987 15.9313 12.9181L16.3175 7.12494C16.3404 6.78053 16.0798 6.48271 15.7354 6.45975C15.391 6.43679 15.0932 6.69738 15.0702 7.04179L14.687 12.7911C14.6121 13.9143 14.5587 14.6958 14.4416 15.2838C14.328 15.8542 14.1693 16.1561 13.9415 16.3692C13.7137 16.5824 13.4019 16.7206 12.8252 16.796C12.2307 16.8738 11.4474 16.875 10.3217 16.875H9.67718C8.55148 16.875 7.76814 16.8738 7.17364 16.796C6.59697 16.7206 6.28518 16.5824 6.05733 16.3692C5.82949 16.1561 5.67088 15.8542 5.55725 15.2838C5.44011 14.6958 5.38675 13.9143 5.31187 12.7911L4.92859 7.04179Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Correct Answer for TRUE_FALSE */}
        {formData.questionType === "TRUE_FALSE" && (
          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              پاسخ صحیح <span className="text-red">*</span>
            </label>

            <div className="flex gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={formData.correctAnswer === true}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, correctAnswer: true }))
                  }
                  className="rounded border-stroke"
                />
                <span className="text-body-sm text-dark dark:text-white">
                  صحیح
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={formData.correctAnswer === false}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, correctAnswer: false }))
                  }
                  className="rounded border-stroke"
                />
                <span className="text-body-sm text-dark dark:text-white">
                  غلط
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Info for SHORT_ANSWER */}
        {formData.questionType === "SHORT_ANSWER" && (
          <div className="mb-5.5 rounded-[7px] border border-stroke bg-[#F7F9FC] p-4 dark:border-dark-3 dark:bg-dark-2">
            <p className="text-body-sm text-dark dark:text-white">
              برای سوالات پاسخ کوتاه، پاسخ‌ها توسط مدرس به صورت دستی بررسی و نمره‌دهی می‌شوند.
            </p>
          </div>
        )}

        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            توضیحات (نمایش داده می‌شود پس از پاسخ دادن)
          </label>

          <textarea
            name="explanation"
            value={formData.explanation || ""}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              امتیاز <span className="text-red">*</span>
            </label>

            <input
              type="number"
              name="points"
              value={formData.points}
              onChange={handleChange}
              required
              min="0"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-1/2">
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
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push(`/quiz-questions?quizId=${formData.quizId}`)}
            className="rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={createQuizQuestion.isPending || updateQuizQuestion.isPending}
            className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {createQuizQuestion.isPending || updateQuizQuestion.isPending
              ? "در حال ذخیره..."
              : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizQuestionForm;
