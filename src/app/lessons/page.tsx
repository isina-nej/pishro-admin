import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import LessonsTable from "@/components/Lessons/LessonsTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت درس‌ها | پنل ادمین پیشرو",
  description: "مدیریت و ویرایش درس‌های دوره‌های آموزشی",
};

const LessonsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="مدیریت درس‌ها" />

      <div className="flex flex-col gap-10">
        <LessonsTable />
      </div>
    </DefaultLayout>
  );
};

export default LessonsPage;
