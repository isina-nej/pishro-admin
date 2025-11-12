import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import TagForm from "@/components/Tags/TagForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "افزودن تگ جدید | پنل ادمین پیشرو",
  description: "ایجاد تگ جدید",
};

const CreateTagPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="افزودن تگ جدید" />
      <TagForm />
    </DefaultLayout>
  );
};

export default CreateTagPage;
