import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import UserForm from "@/components/Users/UserForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "افزودن کاربر جدید | پنل ادمین پیشرو",
  description: "ایجاد کاربر جدید",
};

const CreateUserPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="افزودن کاربر جدید" />
      <UserForm />
    </DefaultLayout>
  );
};

export default CreateUserPage;
