import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import FAQForm from "@/components/FAQs/FAQForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "افزودن سوال جدید | پنل ادمین پیشرو",
  description: "ایجاد سوال متداول جدید",
};

const CreateFAQPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="افزودن سوال جدید" />
      <FAQForm />
    </DefaultLayout>
  );
};

export default CreateFAQPage;
