import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import NewsCommentForm from "@/components/NewsComments/NewsCommentForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "افزودن نظر خبری جدید | پنل ادمین پیشرو",
  description: "افزودن نظر جدید به اخبار",
};

const CreateNewsCommentPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="افزودن نظر خبری جدید" />

      <div className="flex flex-col gap-10">
        <NewsCommentForm />
      </div>
    </DefaultLayout>
  );
};

export default CreateNewsCommentPage;
