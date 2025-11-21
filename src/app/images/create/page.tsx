import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ImageForm from "@/components/Images/ImageForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "آپلود تصویر | پنل ادمین پیشرو",
  description: "آپلود تصویر جدید",
};

const CreateImagePage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="آپلود تصویر" />
      <ImageForm />
    </DefaultLayout>
  );
};

export default CreateImagePage;
