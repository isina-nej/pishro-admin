"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import TransactionsTable from "@/components/Transactions/TransactionsTable";

const TransactionsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="مدیریت تراکنش‌ها" />
      <TransactionsTable />
    </DefaultLayout>
  );
};

export default TransactionsPage;
