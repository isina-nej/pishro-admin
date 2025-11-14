"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import InvestmentPlansForm from "@/components/InvestmentPlans/InvestmentPlansForm";
import { useInvestmentPlans } from "@/hooks/api";

const InvestmentPlansPage = () => {
  const router = useRouter();
  const { data, isLoading, error } = useInvestmentPlans({ page: 1, limit: 1 });
  const [planId, setPlanId] = useState<string | undefined>(undefined);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (data?.items && data.items.length > 0) {
      setPlanId(data.items[0].id);
      setIsEdit(true);
    } else if (data?.items && data.items.length === 0) {
      setIsEdit(false);
    }
  }, [data]);

  if (isLoading) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="سبدهای سرمایه‌گذاری" />
        <div className="rounded-[10px] border border-stroke bg-white p-7 text-center">
          <p>در حال بارگذاری...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="سبدهای سرمایه‌گذاری" />
        <div className="rounded-[10px] border border-stroke bg-white p-7">
          <p className="text-danger">خطا در بارگذاری اطلاعات</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="سبدهای سرمایه‌گذاری" />
      <div className="flex flex-col gap-10">
        <InvestmentPlansForm planId={planId} isEdit={isEdit} />
      </div>
    </DefaultLayout>
  );
};

export default InvestmentPlansPage;
