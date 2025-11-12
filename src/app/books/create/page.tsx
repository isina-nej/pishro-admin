import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import BookForm from "@/components/Books/BookForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "افزودن کتاب جدید | پنل ادمین پیشرو",
  description: "ایجاد کتاب دیجیتال جدید",
};

const CreateBookPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="افزودن کتاب جدید" />
      <BookForm />
    </DefaultLayout>
  );
};

export default CreateBookPage;
