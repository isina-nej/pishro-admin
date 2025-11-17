import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import QuizAttemptsTable from "@/components/QuizAttempts/QuizAttemptsTable";

export const metadata: Metadata = {
  title: "تلاش‌های آزمون | پیشرو ادمین",
  description: "مدیریت تلاش‌های آزمون کاربران",
};

const QuizAttemptsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="تلاش‌های آزمون" />

      <div className="flex flex-col gap-10">
        <QuizAttemptsTable />
      </div>
    </DefaultLayout>
  );
};

export default QuizAttemptsPage;
