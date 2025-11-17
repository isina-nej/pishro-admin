import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import PageContentForm from "@/components/PageContent/PageContentForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "افزودن محتوای صفحه جدید | پنل ادمین پیشرو",
  description: "ایجاد محتوای صفحه جدید",
};

const CreatePageContentPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="افزودن محتوای صفحه جدید" />

      <PageContentForm />
    </DefaultLayout>
  );
};

export default CreatePageContentPage;
