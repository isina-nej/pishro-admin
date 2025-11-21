import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import CategoriesTable from "@/components/Categories/CategoriesTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت دسته‌بندی کورس‌ها | پنل ادمین پیشرو",
  description: "مدیریت دسته‌بندی‌های دوره‌های آموزشی",
};

const CourseCategoriesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="دسته‌بندی کورس‌ها" />

      <div className="flex flex-col gap-10">
        <CategoriesTable />
      </div>
    </DefaultLayout>
  );
};

export default CourseCategoriesPage;
