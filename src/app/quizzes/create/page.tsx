import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import DefaultLayout from "@/components/Layouts/DefaultLaout";

import QuizForm from "@/components/Quizzes/QuizForm";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "افزودن آزمون جدید | پنل ادمین پیشرو",

  description: "ایجاد آزمون جدید",
};

const CreateQuizPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="افزودن آزمون جدید" />

      <QuizForm />
    </DefaultLayout>
  );
};

export default CreateQuizPage;
