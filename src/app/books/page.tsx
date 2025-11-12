import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import BooksTable from "@/components/Books/BooksTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت کتاب‌های دیجیتال | پنل ادمین پیشرو",
  description: "مدیریت کتاب‌های دیجیتال وب‌سایت",
};

const BooksPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="مدیریت کتاب‌های دیجیتال" />
      <div className="flex flex-col gap-10">
        <BooksTable />
      </div>
    </DefaultLayout>
  );
};

export default BooksPage;
