import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import VideoForm from "@/components/Videos/VideoForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "آپلود ویدیو | پنل ادمین پیشرو",
  description: "آپلود ویدیو جدید",
};

const CreateVideoPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="آپلود ویدیو" />
      <VideoForm />
    </DefaultLayout>
  );
};

export default CreateVideoPage;
