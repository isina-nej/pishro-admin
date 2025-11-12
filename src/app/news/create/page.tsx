import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import NewsForm from "@/components/News/NewsForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "افزودن خبر جدید | پنل ادمین پیشرو",
  description: "ایجاد خبر یا مقاله جدید",
};

const CreateNewsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="افزودن خبر جدید" />
      <NewsForm />
    </DefaultLayout>
  );
};

export default CreateNewsPage;
