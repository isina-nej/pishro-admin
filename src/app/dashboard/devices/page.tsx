'use client';

import React, { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { ProtectedRoute } from "@/components/protected-route";
import { useDashboardDevices } from "@/hooks/api/use-dashboard";
import dynamic from 'next/dynamic';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function DevicesPage() {
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const { data: devicesData, isLoading, error } = useDashboardDevices({ period });

  const series = devicesData
    ? [devicesData.desktop, devicesData.tablet, devicesData.mobile, devicesData.unknown]
    : [0, 0, 0, 0];

  const options: any = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
    },
    colors: ["#5750F1", "#5475E5", "#8099EC", "#ADBCF2"],
    labels: ["دسکتاپ", "تبلت", "موبایل", "نامشخص"],
    legend: {
      show: true,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          background: "transparent",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "کل بازدیدکنندگان",
              fontSize: "22px",
              fontWeight: "600",
              formatter: function (w: any) {
                return w.globals.seriesTotals.reduce((a: number, b: number) => {
                  return a + b;
                }, 0);
              }
            },
            value: {
              show: true,
              fontSize: "36px",
              fontWeight: "bold",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(1) + "%";
      }
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 500,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 300,
          },
        },
      },
    ],
  };

  if (error) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <DefaultLayout>
          <Breadcrumb pageName="آمار دستگاه‌ها" />
          <div className="rounded-[10px] bg-red-50 p-6 text-center">
            <p className="text-red-600">خطا در بارگذاری داده‌های دستگاه‌ها</p>
          </div>
        </DefaultLayout>
      </ProtectedRoute>
    );
  }

  if (isLoading) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <DefaultLayout>
          <Breadcrumb pageName="آمار دستگاه‌ها" />
          <div className="rounded-[10px] bg-white p-7.5 shadow-1 dark:bg-gray-dark">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40" />
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </DefaultLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <DefaultLayout>
        <Breadcrumb pageName="آمار دستگاه‌ها" />

        <div className="grid grid-cols-1 gap-4 md:gap-6 2xl:gap-7.5">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-dark dark:text-white">
                    {devicesData?.desktop}%
                  </h4>
                  <span className="text-body-sm font-medium">دسکتاپ</span>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#5750F1]">
                  <svg className="fill-white" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 14H3V4H21V14ZM22 2H2C1.45 2 1 2.45 1 3V15C1 15.55 1.45 16 2 16H9V18H7V20H17V18H15V16H22C22.55 16 23 15.55 23 15V3C23 2.45 22.55 2 22 2Z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-dark dark:text-white">
                    {devicesData?.tablet}%
                  </h4>
                  <span className="text-body-sm font-medium">تبلت</span>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#5475E5]">
                  <svg className="fill-white" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 0H6C4.34 0 3 1.34 3 3V21C3 22.66 4.34 24 6 24H18C19.66 24 21 22.66 21 21V3C21 1.34 19.66 0 18 0ZM12 22C11.17 22 10.5 21.33 10.5 20.5C10.5 19.67 11.17 19 12 19C12.83 19 13.5 19.67 13.5 20.5C13.5 21.33 12.83 22 12 22ZM19 18H5V4H19V18Z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-dark dark:text-white">
                    {devicesData?.mobile}%
                  </h4>
                  <span className="text-body-sm font-medium">موبایل</span>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#8099EC]">
                  <svg className="fill-white" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 0H7C5.34 0 4 1.34 4 3V21C4 22.66 5.34 24 7 24H17C18.66 24 20 22.66 20 21V3C20 1.34 18.66 0 17 0ZM12 22C11.17 22 10.5 21.33 10.5 20.5C10.5 19.67 11.17 19 12 19C12.83 19 13.5 19.67 13.5 20.5C13.5 21.33 12.83 22 12 22ZM18 18H6V4H18V18Z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-dark dark:text-white">
                    {devicesData?.totalVisitors.toLocaleString('fa-IR')}
                  </h4>
                  <span className="text-body-sm font-medium">کل بازدیدکنندگان</span>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ADBCF2]">
                  <svg className="fill-white" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-[10px] bg-white p-7.5 shadow-1 dark:bg-gray-dark">
            <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-2xl font-bold text-dark dark:text-white">
                  توزیع دستگاه‌های استفاده‌شده
                </h4>
                <p className="mt-2 text-body-sm text-dark-6">
                  آمار دستگاه‌های استفاده‌شده توسط بازدیدکنندگان سایت
                </p>
              </div>
              <div>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as 'monthly' | 'yearly')}
                  className="relative z-20 inline-flex appearance-none rounded border border-stroke bg-transparent py-2 px-4 font-medium outline-none dark:border-dark-3"
                >
                  <option value="monthly">ماهانه</option>
                  <option value="yearly">سالانه</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <ReactApexChart options={options} series={series} type="donut" height={450} />
            </div>

            {/* Device Details Table */}
            <div className="mt-9">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="text-center">
                  <div className="mb-2 flex items-center justify-center">
                    <span className="block h-3 w-12 rounded-full bg-[#5750F1]"></span>
                  </div>
                  <p className="text-sm font-medium text-dark dark:text-dark-6">دسکتاپ</p>
                  <p className="mt-1 text-xl font-bold text-dark dark:text-white">
                    {devicesData?.desktop}%
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-2 flex items-center justify-center">
                    <span className="block h-3 w-12 rounded-full bg-[#5475E5]"></span>
                  </div>
                  <p className="text-sm font-medium text-dark dark:text-dark-6">تبلت</p>
                  <p className="mt-1 text-xl font-bold text-dark dark:text-white">
                    {devicesData?.tablet}%
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-2 flex items-center justify-center">
                    <span className="block h-3 w-12 rounded-full bg-[#8099EC]"></span>
                  </div>
                  <p className="text-sm font-medium text-dark dark:text-dark-6">موبایل</p>
                  <p className="mt-1 text-xl font-bold text-dark dark:text-white">
                    {devicesData?.mobile}%
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-2 flex items-center justify-center">
                    <span className="block h-3 w-12 rounded-full bg-[#ADBCF2]"></span>
                  </div>
                  <p className="text-sm font-medium text-dark dark:text-dark-6">نامشخص</p>
                  <p className="mt-1 text-xl font-bold text-dark dark:text-white">
                    {devicesData?.unknown}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </ProtectedRoute>
  );
}
