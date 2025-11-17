"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import LessonForm from "@/components/Lessons/LessonForm";
import { useParams } from "next/navigation";

const EditLessonPage = () => {
  const params = useParams();
  const lessonId = params.id as string;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش درس" />

      <div className="flex flex-col gap-10">
        <LessonForm lessonId={lessonId} isEdit={true} />
      </div>
    </DefaultLayout>
  );
};

export default EditLessonPage;
