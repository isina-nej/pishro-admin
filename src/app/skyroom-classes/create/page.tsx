import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import SkyRoomClassForm from "@/components/SkyRoomClasses/SkyRoomClassForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "افزودن کلاس Skyroom جدید | پنل ادمین پیشرو",
  description: "افزودن کلاس آنلاین Skyroom جدید",
};

const CreateSkyRoomClassPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="افزودن کلاس Skyroom جدید" />
      <SkyRoomClassForm />
    </DefaultLayout>
  );
};

export default CreateSkyRoomClassPage;
