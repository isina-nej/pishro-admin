import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import TagsTable from "@/components/Tags/TagsTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت تگ‌ها | پنل ادمین پیشرو",
  description: "مدیریت تگ‌های وب‌سایت",
};

const TagsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="مدیریت تگ‌ها" />
      <div className="flex flex-col gap-10">
        <TagsTable />
      </div>
    </DefaultLayout>
  );
};

export default TagsPage;
