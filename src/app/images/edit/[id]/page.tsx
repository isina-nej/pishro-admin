import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ImageForm from "@/components/Images/ImageForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ویرایش تصویر | پنل ادمین پیشرو",
  description: "ویرایش تصویر",
};

interface EditImagePageProps {
  params: {
    id: string;
  };
}

const EditImagePage = ({ params }: EditImagePageProps) => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش تصویر" />
      <ImageForm imageId={params.id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditImagePage;
