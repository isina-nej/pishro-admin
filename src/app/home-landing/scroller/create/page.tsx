"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import MobileScrollerStepForm from "@/components/MobileScrollerSteps/MobileScrollerStepForm";

const CreateScrollerPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="افزودن بخش جدید اسکرولر" />
      <MobileScrollerStepForm stepId={undefined} isEdit={false} />
    </DefaultLayout>
  );
};

export default CreateScrollerPage;
