"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import CommentForm from "@/components/Comments/CommentForm";

const EditCommentPage = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش نظر" />
      <CommentForm commentId={id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditCommentPage;
