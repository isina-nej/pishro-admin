'use client';

import React, { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { ProtectedRoute } from "@/components/protected-route";
import { useDashboardPayments } from "@/hooks/api/use-dashboard";
import dynamic from 'next/dynamic';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function PaymentsPage() {
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const { data: paymentsData, isLoading, error } = useDashboardPayments({ period });

  const series = paymentsData
    ? [
        {
          name: "مبلغ دریافتی",
          data: paymentsData.receivedAmount,
        },
        {
          name: "مبلغ معوق",
          data: paymentsData.dueAmount,
        },
      ]
    : [
        { name: "مبلغ دریافتی", data: [] },
        { name: "مبلغ معوق", data: [] },
      ];

  const options: any = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#5750F1", "#F87171"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 400,
      type: "area",
      toolbar: {
        show: true,
      },
    },
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    markers: {
      size: 4,
      strokeWidth: 2,
      hover: {
        size: 6,
      }
    },
    grid: {
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      x: {
        show: true,
      },
      y: {
        formatter: function (val: number) {
          return val.toLocaleString('fa-IR') + ' تومان';
        }
      },
    },
    xaxis: {
      type: "category",
      categories: paymentsData?.months || [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: function (val: number) {
          return (val / 1000000).toFixed(1) + 'M';
        }
      }
    },
  };

  // Calculate statistics
  const totalAmount = paymentsData ? paymentsData.totalReceived + paymentsData.totalDue : 0;
  const receivedPercentage = paymentsData && totalAmount > 0
    ? ((paymentsData.totalReceived / totalAmount) * 100).toFixed(1)
    : '0';
  const duePercentage = paymentsData && totalAmount > 0
    ? ((paymentsData.totalDue / totalAmount) * 100).toFixed(1)
    : '0';

  if (error) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <DefaultLayout>
          <Breadcrumb pageName="آمار پرداخت‌ها" />
          <div className="rounded-[10px] bg-red-50 p-6 text-center">
            <p className="text-red-600">خطا در بارگذاری داده‌های پرداخت</p>
          </div>
        </DefaultLayout>
      </ProtectedRoute>
    );
  }

  if (isLoading) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <DefaultLayout>
          <Breadcrumb pageName="آمار پرداخت‌ها" />
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
        <Breadcrumb pageName="آمار پرداخت‌ها" />

        <div className="grid grid-cols-1 gap-4 md:gap-6 2xl:gap-7.5">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-dark dark:text-white">
                    {paymentsData?.totalReceived.toLocaleString('fa-IR')}
                  </h4>
                  <span className="text-body-sm font-medium">کل مبلغ دریافتی (تومان)</span>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#10B981]">
                  <svg className="fill-white" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-dark-6">{receivedPercentage}% از کل</span>
              </div>
            </div>

            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-dark dark:text-white">
                    {paymentsData?.totalDue.toLocaleString('fa-IR')}
                  </h4>
                  <span className="text-body-sm font-medium">کل مبلغ معوق (تومان)</span>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F87171]">
                  <svg className="fill-white" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-dark-6">{duePercentage}% از کل</span>
              </div>
            </div>

            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-dark dark:text-white">
                    {totalAmount.toLocaleString('fa-IR')}
                  </h4>
                  <span className="text-body-sm font-medium">مجموع کل (تومان)</span>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#5750F1]">
                  <svg className="fill-white" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13.41 18.09V19.67C13.41 20.03 13.12 20.33 12.76 20.33H11.23C10.87 20.33 10.58 20.03 10.58 19.67V18.09C9.05 17.83 7.78 16.91 7.47 15.37C7.42 15.09 7.63 14.83 7.92 14.83H9.28C9.5 14.83 9.69 14.99 9.76 15.2C9.95 15.75 10.52 16.25 11.74 16.25C13.28 16.25 13.63 15.5 13.63 15.08C13.63 14.5 13.28 13.92 11.42 13.54C9.22 13.08 7.58 12.25 7.58 10.25C7.58 8.58 8.92 7.5 10.58 7.17V5.67C10.58 5.3 10.87 5 11.23 5H12.76C13.12 5 13.41 5.3 13.41 5.67V7.17C14.76 7.42 15.75 8.25 16.08 9.58C16.13 9.83 15.92 10.08 15.67 10.08H14.42C14.21 10.08 14.03 9.95 13.95 9.75C13.72 9.17 13.23 8.75 12.16 8.75C10.88 8.75 10.41 9.33 10.41 10C10.41 10.58 10.88 11.08 12.5 11.42C14.12 11.75 16.45 12.42 16.45 15.08C16.41 16.75 15.17 17.83 13.41 18.09Z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-dark-6">مجموع دریافتی و معوق</span>
              </div>
            </div>

            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-dark dark:text-white">
                    {paymentsData?.months.length || 0}
                  </h4>
                  <span className="text-body-sm font-medium">تعداد {period === 'monthly' ? 'ماه' : 'سال'}</span>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0ABEF9]">
                  <svg className="fill-white" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20ZM7 11H12V16H7V11Z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-dark-6">بازه زمانی نمودار</span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-[10px] bg-white p-7.5 shadow-1 dark:bg-gray-dark">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-2xl font-bold text-dark dark:text-white">
                  نمودار پرداخت‌ها
                </h4>
                <p className="mt-2 text-body-sm text-dark-6">
                  مقایسه مبالغ دریافتی و معوق در بازه زمانی انتخابی
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

            <div>
              <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={400}
              />
            </div>
          </div>

          {/* Summary Table */}
          <div className="rounded-[10px] bg-white p-7.5 shadow-1 dark:bg-gray-dark">
            <h4 className="mb-6 text-xl font-bold text-dark dark:text-white">
              جزئیات {period === 'monthly' ? 'ماهانه' : 'سالانه'}
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-right dark:bg-dark-2">
                    <th className="py-4 px-4 font-medium text-dark dark:text-white">
                      {period === 'monthly' ? 'ماه' : 'سال'}
                    </th>
                    <th className="py-4 px-4 font-medium text-dark dark:text-white">
                      مبلغ دریافتی (تومان)
                    </th>
                    <th className="py-4 px-4 font-medium text-dark dark:text-white">
                      مبلغ معوق (تومان)
                    </th>
                    <th className="py-4 px-4 font-medium text-dark dark:text-white">
                      جمع کل (تومان)
                    </th>
                    <th className="py-4 px-4 font-medium text-dark dark:text-white">
                      درصد دریافتی
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paymentsData?.months.map((month, index) => {
                    const received = paymentsData.receivedAmount[index];
                    const due = paymentsData.dueAmount[index];
                    const total = received + due;
                    const percentage = total > 0 ? ((received / total) * 100).toFixed(1) : '0';

                    return (
                      <tr key={index} className="border-b border-stroke dark:border-dark-3">
                        <td className="py-4 px-4 text-dark dark:text-white">
                          {month}
                        </td>
                        <td className="py-4 px-4 text-dark dark:text-white">
                          <span className="text-green">{received.toLocaleString('fa-IR')}</span>
                        </td>
                        <td className="py-4 px-4 text-dark dark:text-white">
                          <span className="text-red">{due.toLocaleString('fa-IR')}</span>
                        </td>
                        <td className="py-4 px-4 text-dark dark:text-white">
                          {total.toLocaleString('fa-IR')}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 rounded-full bg-gray-2 dark:bg-dark-3">
                              <div
                                className="h-2 rounded-full bg-green"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-dark dark:text-white">{percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </ProtectedRoute>
  );
}
