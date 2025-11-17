"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import QuizAttemptDetail from "@/components/QuizAttempts/QuizAttemptDetail";
import { useQuizAttempt } from "@/hooks/api/use-quiz-attempts";

const QuizAttemptDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  const { data: attempt, isLoading, error } = useQuizAttempt(id);

  if (isLoading) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="جزئیات تلاش آزمون" />
        <div className="rounded-[10px] border border-stroke bg-white p-7 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
          <p>در حال بارگذاری...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (error || !attempt) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="جزئیات تلاش آزمون" />
        <div className="rounded-[10px] border border-stroke bg-white p-7 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
          <p className="text-danger">خطا در بارگذاری تلاش آزمون</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="جزئیات تلاش آزمون" />
      <QuizAttemptDetail attempt={attempt} />
    </DefaultLayout>
  );
};

export default QuizAttemptDetailPage;
