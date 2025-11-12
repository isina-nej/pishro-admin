"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import TagForm from "@/components/Tags/TagForm";

const EditTagPage = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش تگ" />
      <TagForm tagId={id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditTagPage;
