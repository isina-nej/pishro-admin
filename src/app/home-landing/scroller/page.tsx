"use client";

import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import MobileScrollerStepsTable from "@/components/MobileScrollerSteps/MobileScrollerStepsTable";

const ScrollerManagementPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="مدیریت مراحل اسکرولر" />
      <div className="flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-dark dark:text-white">
            لیست مراحل اسکرولر موبایل
          </h2>
          <Link
            href="/home-landing/scroller/create"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-center font-medium text-white hover:bg-opacity-90"
          >
            <svg
              className="ml-2 fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 4.16669V15.8334M4.16669 10H15.8334"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            افزودن بخش جدید
          </Link>
        </div>
        <MobileScrollerStepsTable />
      </div>
    </DefaultLayout>
  );
};

export default ScrollerManagementPage;
