"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import CourseForm from "@/components/Courses/CourseForm";

const EditCoursePage = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="HÌ1'Ì4 /H1G" />
      <CourseForm courseId={id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditCoursePage;
