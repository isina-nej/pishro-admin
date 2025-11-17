import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import PageContentsTable from "@/components/PageContent/PageContentsTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت محتوای صفحات | پنل ادمین پیشرو",
  description: "مدیریت و ویرایش محتوای صفحات",
};

const PageContentPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="مدیریت محتوای صفحات" />

      <div className="flex flex-col gap-10">
        <PageContentsTable />
      </div>
    </DefaultLayout>
  );
};

export default PageContentPage;
