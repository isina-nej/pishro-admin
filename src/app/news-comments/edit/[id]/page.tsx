"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import NewsCommentForm from "@/components/NewsComments/NewsCommentForm";

interface EditNewsCommentPageProps {
  params: {
    id: string;
  };
}

const EditNewsCommentPage = ({ params }: EditNewsCommentPageProps) => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش نظر خبری" />

      <div className="flex flex-col gap-10">
        <NewsCommentForm commentId={params.id} isEdit={true} />
      </div>
    </DefaultLayout>
  );
};

export default EditNewsCommentPage;
