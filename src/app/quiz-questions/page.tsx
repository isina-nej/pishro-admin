import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import QuizQuestionsTable from "@/components/QuizQuestions/QuizQuestionsTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت سوالات آزمون | پنل ادمین پیشرو",
  description: "مدیریت و ویرایش سوالات آزمون",
};

const QuizQuestionsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="مدیریت سوالات آزمون" />

      <div className="flex flex-col gap-10">
        <QuizQuestionsTable />
      </div>
    </DefaultLayout>
  );
};

export default QuizQuestionsPage;
