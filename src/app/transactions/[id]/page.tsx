"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import TransactionDetail from "@/components/Transactions/TransactionDetail";
import { useTransaction } from "@/hooks/api/use-transactions";

const TransactionDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  const { data: transaction, isLoading, error } = useTransaction(id);

  if (isLoading) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="جزئیات تراکنش" />
        <div className="rounded-[10px] border border-stroke bg-white p-7">
          <p>در حال بارگذاری...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (error || !transaction) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="جزئیات تراکنش" />
        <div className="rounded-[10px] border border-stroke bg-white p-7">
          <p className="text-danger">خطا در بارگذاری تراکنش</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="جزئیات تراکنش" />
      <TransactionDetail transaction={transaction} />
    </DefaultLayout>
  );
};

export default TransactionDetailPage;
