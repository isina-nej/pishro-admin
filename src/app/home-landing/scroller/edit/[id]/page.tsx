"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import MobileScrollerStepForm from "@/components/MobileScrollerSteps/MobileScrollerStepForm";

const EditScrollerPage = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش بخش اسکرولر" />
      <MobileScrollerStepForm stepId={id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditScrollerPage;
