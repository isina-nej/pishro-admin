import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import CategoryForm from "@/components/Categories/CategoryForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "افزودن دسته‌بندی جدید | پنل ادمین پیشرو",
  description: "ایجاد دسته‌بندی جدید",
};

const CreateCategoryPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="افزودن دسته‌بندی جدید" />
      <CategoryForm />
    </DefaultLayout>
  );
};

export default CreateCategoryPage;
