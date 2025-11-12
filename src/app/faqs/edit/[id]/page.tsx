"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import FAQForm from "@/components/FAQs/FAQForm";

const EditFAQPage = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش سوال" />
      <FAQForm faqId={id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditFAQPage;
