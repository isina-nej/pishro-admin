"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import InvestmentModelsPageForm from "@/components/InvestmentModels/InvestmentModelsPageForm";
import { useInvestmentModelsPages } from "@/hooks/api";

const InvestmentModelsPage = () => {
  const router = useRouter();
  const { data, isLoading, error } = useInvestmentModelsPages({
    page: 1,
    limit: 1,
  });
  const [pageId, setPageId] = useState<string | undefined>(undefined);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (data?.data?.items && data.data.items.length > 0) {
      setPageId(data.data.items[0].id);
      setIsEdit(true);
    } else if (data?.data?.items && data.data.items.length === 0) {
      setIsEdit(false);
    }
  }, [data]);

  if (isLoading) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="مدل‌های سرمایه‌گذاری" />
        <div className="rounded-[10px] border border-stroke bg-white p-7 text-center">
          <p>در حال بارگذاری...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="مدل‌های سرمایه‌گذاری" />
        <div className="rounded-[10px] border border-stroke bg-white p-7">
          <p className="text-danger">خطا در بارگذاری اطلاعات</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="مدل‌های سرمایه‌گذاری" />
      <div className="flex flex-col gap-10">
        <InvestmentModelsPageForm pageId={pageId} isEdit={isEdit} />
      </div>
    </DefaultLayout>
  );
};

export default InvestmentModelsPage;
