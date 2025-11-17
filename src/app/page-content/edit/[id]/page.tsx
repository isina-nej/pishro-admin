"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import PageContentForm from "@/components/PageContent/PageContentForm";

const EditPageContentPage = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش محتوای صفحه" />
      <PageContentForm contentId={id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditPageContentPage;
