"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import NewsForm from "@/components/News/NewsForm";

const EditNewsPage = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش خبر" />
      <NewsForm newsId={id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditNewsPage;
