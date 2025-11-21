import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import VideoForm from "@/components/Videos/VideoForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ویرایش ویدیو | پنل ادمین پیشرو",
  description: "ویرایش ویدیو",
};

interface EditVideoPageProps {
  params: {
    id: string;
  };
}

const EditVideoPage = ({ params }: EditVideoPageProps) => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش ویدیو" />
      <VideoForm videoId={params.id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditVideoPage;
