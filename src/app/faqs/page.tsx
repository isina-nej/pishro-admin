import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import FAQsTable from "@/components/FAQs/FAQsTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت سوالات متداول | پنل ادمین پیشرو",
  description: "مدیریت سوالات متداول وب‌سایت",
};

const FAQsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="مدیریت سوالات متداول" />
      <div className="flex flex-col gap-10">
        <FAQsTable />
      </div>
    </DefaultLayout>
  );
};

export default FAQsPage;
