import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import NewsCommentsTable from "@/components/NewsComments/NewsCommentsTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت نظرات اخبار | پنل ادمین پیشرو",
  description: "مدیریت نظرات کاربران در اخبار",
};

const NewsCommentsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="مدیریت نظرات اخبار" />

      <div className="flex flex-col gap-10">
        <NewsCommentsTable />
      </div>
    </DefaultLayout>
  );
};

export default NewsCommentsPage;
