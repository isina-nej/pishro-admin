"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import QuizForm from "@/components/Quizzes/QuizForm";

const EditQuizPage = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش آزمون" />
      <QuizForm quizId={id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditQuizPage;
