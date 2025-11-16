import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import SkyRoomClassesTable from "@/components/SkyRoomClasses/SkyRoomClassesTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت کلاس‌های Skyroom | پنل ادمین پیشرو",
  description: "مدیریت و ویرایش کلاس‌های آنلاین Skyroom",
};

const SkyRoomClassesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="مدیریت کلاس‌های Skyroom" />
      <div className="flex flex-col gap-10">
        <SkyRoomClassesTable />
      </div>
    </DefaultLayout>
  );
};

export default SkyRoomClassesPage;
