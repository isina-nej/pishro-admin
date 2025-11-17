import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import DefaultLayout from "@/components/Layouts/DefaultLaout";

import QuizzesTable from "@/components/Quizzes/QuizzesTable";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت آزمون‌ها | پنل ادمین پیشرو",

  description: "مدیریت و ویرایش آزمون‌ها",
};

const QuizzesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="مدیریت آزمون‌ها" />

      <div className="flex flex-col gap-10">
        <QuizzesTable />
      </div>
    </DefaultLayout>
  );
};

export default QuizzesPage;
