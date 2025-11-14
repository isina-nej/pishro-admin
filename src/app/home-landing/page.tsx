"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import HomeLandingForm from "@/components/HomeLanding/HomeLandingForm";
import { useHomeLanding } from "@/hooks/api";

const HomeLandingPage = () => {
  const router = useRouter();
  const { data, isLoading, error } = useHomeLanding({ page: 1, limit: 1 });
  const [homeLandingId, setHomeLandingId] = useState<string | undefined>(undefined);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (data?.items && data.items.length > 0) {
      setHomeLandingId(data.items[0].id);
      setIsEdit(true);
    } else if (data?.items && data.items.length === 0) {
      setIsEdit(false);
    }
  }, [data]);

  if (isLoading) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="مدیریت صفحه اصلی" />
        <div className="rounded-[10px] border border-stroke bg-white p-7 text-center">
          <p>در حال بارگذاری...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="مدیریت صفحه اصلی" />
        <div className="rounded-[10px] border border-stroke bg-white p-7">
          <p className="text-danger">خطا در بارگذاری اطلاعات</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="مدیریت صفحه اصلی" />
      <div className="flex flex-col gap-10">
        <HomeLandingForm homeLandingId={homeLandingId} isEdit={isEdit} />
      </div>
    </DefaultLayout>
  );
};

export default HomeLandingPage;
