import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import InvestmentModelsPageForm from "@/components/InvestmentModelsPage/InvestmentModelsPageForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ویرایش صفحه مدل‌های سرمایه‌گذاری | پنل ادمین پیشرو",
  description: "ویرایش صفحه مدل‌های سرمایه‌گذاری",
};

interface EditInvestmentModelsPagePageProps {
  params: {
    id: string;
  };
}

const EditInvestmentModelsPagePage = ({ params }: EditInvestmentModelsPagePageProps) => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش صفحه مدل‌های سرمایه‌گذاری" />
      <InvestmentModelsPageForm pageId={params.id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditInvestmentModelsPagePage;
