import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import InvestmentModelsPageTable from "@/components/InvestmentModelsPage/InvestmentModelsPageTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت صفحات مدل‌های سرمایه‌گذاری | پنل ادمین پیشرو",
  description: "مدیریت صفحات مدل‌های سرمایه‌گذاری",
};

const InvestmentModelsPageListPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="صفحات مدل‌های سرمایه‌گذاری" />

      <div className="flex flex-col gap-10">
        <InvestmentModelsPageTable />
      </div>
    </DefaultLayout>
  );
};

export default InvestmentModelsPageListPage;
