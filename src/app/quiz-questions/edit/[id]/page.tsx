"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import QuizQuestionForm from "@/components/QuizQuestions/QuizQuestionForm";

const EditQuizQuestionPage = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش سوال" />
      <QuizQuestionForm questionId={id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditQuizQuestionPage;
