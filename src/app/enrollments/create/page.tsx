import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import EnrollmentForm from "@/components/Enrollments/EnrollmentForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "افزودن ثبت‌نام جدید | پنل ادمین پیشرو",
  description: "ایجاد ثبت‌نام جدید برای کاربر",
};

const CreateEnrollmentPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="افزودن ثبت‌نام جدید" />
      <EnrollmentForm />
    </DefaultLayout>
  );
};

export default CreateEnrollmentPage;
