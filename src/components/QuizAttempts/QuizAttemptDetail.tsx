"use client";

import React from "react";
import Link from "next/link";
import type { QuizAttemptWithRelations } from "@/types/api";

interface QuizAttemptDetailProps {
  attempt: QuizAttemptWithRelations;
}

const QuizAttemptDetail: React.FC<QuizAttemptDetailProps> = ({ attempt }) => {
  // Parse answers JSON safely
  let answers: Array<{ questionId: string; answer: string | string[] }> = [];
  try {
    answers = JSON.parse(JSON.stringify(attempt.answers));
  } catch (error) {
    console.error("Error parsing answers:", error);
  }

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          جزئیات تلاش آزمون
        </h3>
      </div>

      <div className="p-7">
        {/* User and Quiz Info */}
        <div className="mb-8 grid grid-cols-1 gap-5.5 sm:grid-cols-2">
          <div className="rounded-lg border border-stroke bg-gray-2 p-5 dark:border-dark-3 dark:bg-dark-2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              اطلاعات کاربر
            </label>
            <div className="space-y-2">
              <p className="font-medium text-dark dark:text-white">
                {attempt.user.firstName} {attempt.user.lastName}
              </p>
              {attempt.user.email && (
                <p className="text-body text-body-sm">{attempt.user.email}</p>
              )}
              {attempt.user.phone && (
                <p className="text-body text-body-sm">{attempt.user.phone}</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-stroke bg-gray-2 p-5 dark:border-dark-3 dark:bg-dark-2">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              اطلاعات آزمون
            </label>
            <div className="space-y-2">
              <p className="font-medium text-dark dark:text-white">
                {attempt.quiz.title}
              </p>
              {attempt.quiz.description && (
                <p className="text-body text-body-sm">
                  {attempt.quiz.description}
                </p>
              )}
              <p className="text-body text-body-sm">
                نمره قبولی: {attempt.quiz.passingScore}%
              </p>
            </div>
          </div>
        </div>

        {/* Score and Status */}
        <div className="mb-8 grid grid-cols-1 gap-5.5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              نمره نهایی
            </label>
            <p className="text-2xl font-bold text-dark dark:text-white">
              {attempt.score.toFixed(1)}%
            </p>
          </div>

          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              امتیاز
            </label>
            <p className="text-xl font-medium text-dark dark:text-white">
              {attempt.totalPoints} / {attempt.maxPoints}
            </p>
          </div>

          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              وضعیت
            </label>
            <span
              className={`inline-flex rounded-full px-4 py-2 text-body-sm font-medium ${
                attempt.passed
                  ? "bg-[#219653]/[0.08] text-[#219653]"
                  : "bg-[#D34053]/[0.08] text-[#D34053]"
              }`}
            >
              {attempt.passed ? "قبول شده" : "مردود"}
            </span>
          </div>

          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              زمان صرف شده
            </label>
            <p className="text-dark dark:text-white">
              {attempt.timeSpent
                ? `${Math.floor(attempt.timeSpent / 60)} دقیقه ${attempt.timeSpent % 60} ثانیه`
                : "نامشخص"}
            </p>
          </div>
        </div>

        {/* Dates */}
        <div className="mb-8 grid grid-cols-1 gap-5.5 sm:grid-cols-2">
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              تاریخ شروع
            </label>
            <p className="text-dark dark:text-white">
              {new Date(attempt.startedAt).toLocaleString("fa-IR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {attempt.completedAt && (
            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                تاریخ تکمیل
              </label>
              <p className="text-dark dark:text-white">
                {new Date(attempt.completedAt).toLocaleString("fa-IR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </div>

        {/* Answers */}
        {answers.length > 0 && (
          <div className="mb-8">
            <label className="mb-4 block text-lg font-medium text-dark dark:text-white">
              پاسخ‌های کاربر
            </label>
            <div className="space-y-4">
              {answers.map((answer, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-stroke bg-gray-2 p-4 dark:border-dark-3 dark:bg-dark-2"
                >
                  <p className="mb-2 text-body-sm font-medium text-dark dark:text-white">
                    سوال {index + 1} (شناسه: {answer.questionId})
                  </p>
                  <div className="rounded bg-white p-3 dark:bg-gray-dark">
                    {Array.isArray(answer.answer) ? (
                      <ul className="list-inside list-disc space-y-1">
                        {answer.answer.map((ans, idx) => (
                          <li key={idx} className="text-dark dark:text-white">
                            {ans}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-dark dark:text-white">
                        {answer.answer}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Raw JSON View */}
        <div className="mb-8">
          <details className="group">
            <summary className="cursor-pointer text-body-sm font-medium text-dark hover:text-primary dark:text-white">
              نمایش داده‌های خام JSON
            </summary>
            <div className="mt-3 rounded-lg border border-stroke bg-gray-2 p-4 dark:border-dark-3 dark:bg-dark-2">
              <pre className="overflow-x-auto text-xs text-dark dark:text-white">
                {JSON.stringify(attempt.answers, null, 2)}
              </pre>
            </div>
          </details>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Link
            href="/quiz-attempts"
            className="inline-flex items-center gap-2 rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90 dark:bg-dark-2 dark:text-white"
          >
            بازگشت به لیست
          </Link>

          <div className="flex gap-3">
            <Link
              href={`/quizzes/edit/${attempt.quiz.id}`}
              className="inline-flex items-center gap-2 rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
            >
              مشاهده آزمون
            </Link>

            <Link
              href={`/users/edit/${attempt.user.id}`}
              className="inline-flex items-center gap-2 rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
            >
              مشاهده کاربر
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAttemptDetail;
