import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import InvestmentModelsPageForm from "@/components/InvestmentModelsPage/InvestmentModelsPageForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "افزودن صفحه مدل‌های سرمایه‌گذاری | پنل ادمین پیشرو",
  description: "ایجاد صفحه مدل‌های سرمایه‌گذاری جدید",
};

const CreateInvestmentModelsPagePage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="افزودن صفحه مدل‌های سرمایه‌گذاری" />
      <InvestmentModelsPageForm />
    </DefaultLayout>
  );
};

export default CreateInvestmentModelsPagePage;
