"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import EnrollmentForm from "@/components/Enrollments/EnrollmentForm";

const EditEnrollmentPage = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش ثبت‌نام" />
      <EnrollmentForm enrollmentId={id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditEnrollmentPage;
