'use client';

import React, { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { ProtectedRoute } from "@/components/protected-route";
import { useDashboardProfit } from "@/hooks/api/use-dashboard";
import dynamic from 'next/dynamic';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ProfitPage() {
  const [period, setPeriod] = useState<'this_week' | 'last_week'>('this_week');
  const { data: profitData, isLoading, error } = useDashboardProfit({ period });

  const series = profitData
    ? [
        {
          name: "فروش",
          data: profitData.sales,
        },
        {
          name: "درآمد",
          data: profitData.revenue,
        },
      ]
    : [
        { name: "فروش", data: [] },
        { name: "درآمد", data: [] },
      ];

  const options: any = {
    colors: ["#5750F1", "#0ABEF9"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "bar",
      height: 400,
      stacked: true,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: "40%",
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    dataLabels: {
      enabled: false,
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
    xaxis: {
      categories: profitData?.days || [],
    },
    yaxis: {
      labels: {
        formatter: function (val: number) {
          return (val / 1000000).toFixed(1) + 'M';
        }
      }
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Satoshi",
      fontWeight: 500,
      fontSize: "14px",
      markers: {
        radius: 99,
        width: 16,
        height: 16,
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val.toLocaleString('fa-IR') + ' تومان';
        }
      }
    }
  };

  // Calculate statistics
  const totalSales = profitData ? profitData.sales.reduce((a, b) => a + b, 0) : 0;
  const totalRevenue = profitData ? profitData.revenue.reduce((a, b) => a + b, 0) : 0;
  const averageSales = profitData && profitData.sales.length > 0
    ? totalSales / profitData.sales.length
    : 0;
  const averageRevenue = profitData && profitData.revenue.length > 0
    ? totalRevenue / profitData.revenue.length
    : 0;
  const profitMargin = totalSales > 0 ? ((totalRevenue / totalSales) * 100).toFixed(1) : '0';

  if (error) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <DefaultLayout>
          <Breadcrumb pageName="آمار سود" />
          <div className="rounded-[10px] bg-red-50 p-6 text-center">
            <p className="text-red-600">خطا در بارگذاری داده‌های سود</p>
          </div>
        </DefaultLayout>
      </ProtectedRoute>
    );
  }

  if (isLoading) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <DefaultLayout>
          <Breadcrumb pageName="آمار سود" />
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
        <Breadcrumb pageName="آمار سود هفتگی" />

        <div className="grid grid-cols-1 gap-4 md:gap-6 2xl:gap-7.5">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-dark dark:text-white">
                    {totalSales.toLocaleString('fa-IR')}
                  </h4>
                  <span className="text-body-sm font-medium">کل فروش (تومان)</span>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#5750F1]">
                  <svg className="fill-white" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-dark-6">
                  {period === 'this_week' ? 'این هفته' : 'هفته گذشته'}
                </span>
              </div>
            </div>

            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-dark dark:text-white">
                    {totalRevenue.toLocaleString('fa-IR')}
                  </h4>
                  <span className="text-body-sm font-medium">کل درآمد (تومان)</span>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0ABEF9]">
                  <svg className="fill-white" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13.41 18.09V19.67C13.41 20.03 13.12 20.33 12.76 20.33H11.23C10.87 20.33 10.58 20.03 10.58 19.67V18.09C9.05 17.83 7.78 16.91 7.47 15.37C7.42 15.09 7.63 14.83 7.92 14.83H9.28C9.5 14.83 9.69 14.99 9.76 15.2C9.95 15.75 10.52 16.25 11.74 16.25C13.28 16.25 13.63 15.5 13.63 15.08C13.63 14.5 13.28 13.92 11.42 13.54C9.22 13.08 7.58 12.25 7.58 10.25C7.58 8.58 8.92 7.5 10.58 7.17V5.67C10.58 5.3 10.87 5 11.23 5H12.76C13.12 5 13.41 5.3 13.41 5.67V7.17C14.76 7.42 15.75 8.25 16.08 9.58C16.13 9.83 15.92 10.08 15.67 10.08H14.42C14.21 10.08 14.03 9.95 13.95 9.75C13.72 9.17 13.23 8.75 12.16 8.75C10.88 8.75 10.41 9.33 10.41 10C10.41 10.58 10.88 11.08 12.5 11.42C14.12 11.75 16.45 12.42 16.45 15.08C16.41 16.75 15.17 17.83 13.41 18.09Z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-dark-6">
                  {period === 'this_week' ? 'این هفته' : 'هفته گذشته'}
                </span>
              </div>
            </div>

            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-dark dark:text-white">
                    {averageSales.toLocaleString('fa-IR', { maximumFractionDigits: 0 })}
                  </h4>
                  <span className="text-body-sm font-medium">میانگین فروش روزانه</span>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#8B5CF6]">
                  <svg className="fill-white" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-dark-6">تومان</span>
              </div>
            </div>

            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-dark dark:text-white">
                    {profitMargin}%
                  </h4>
                  <span className="text-body-sm font-medium">حاشیه سود</span>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#10B981]">
                  <svg className="fill-white" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-dark-6">درآمد / فروش</span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-[10px] bg-white p-7.5 shadow-1 dark:bg-gray-dark">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-2xl font-bold text-dark dark:text-white">
                  نمودار سود هفتگی
                </h4>
                <p className="mt-2 text-body-sm text-dark-6">
                  مقایسه فروش و درآمد روزانه در هفته {period === 'this_week' ? 'جاری' : 'گذشته'}
                </p>
              </div>
              <div>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as 'this_week' | 'last_week')}
                  className="relative z-20 inline-flex appearance-none rounded border border-stroke bg-transparent py-2 px-4 font-medium outline-none dark:border-dark-3"
                >
                  <option value="this_week">این هفته</option>
                  <option value="last_week">هفته گذشته</option>
                </select>
              </div>
            </div>

            <div>
              <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height={400}
              />
            </div>
          </div>

          {/* Daily Details Table */}
          <div className="rounded-[10px] bg-white p-7.5 shadow-1 dark:bg-gray-dark">
            <h4 className="mb-6 text-xl font-bold text-dark dark:text-white">
              جزئیات روزانه
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-right dark:bg-dark-2">
                    <th className="py-4 px-4 font-medium text-dark dark:text-white">
                      روز
                    </th>
                    <th className="py-4 px-4 font-medium text-dark dark:text-white">
                      فروش (تومان)
                    </th>
                    <th className="py-4 px-4 font-medium text-dark dark:text-white">
                      درآمد (تومان)
                    </th>
                    <th className="py-4 px-4 font-medium text-dark dark:text-white">
                      حاشیه سود (%)
                    </th>
                    <th className="py-4 px-4 font-medium text-dark dark:text-white">
                      نمودار روند
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {profitData?.days.map((day, index) => {
                    const sales = profitData.sales[index];
                    const revenue = profitData.revenue[index];
                    const margin = sales > 0 ? ((revenue / sales) * 100).toFixed(1) : '0';
                    const prevSales = index > 0 ? profitData.sales[index - 1] : sales;
                    const trend = sales > prevSales ? 'up' : sales < prevSales ? 'down' : 'same';

                    return (
                      <tr key={index} className="border-b border-stroke dark:border-dark-3">
                        <td className="py-4 px-4 font-medium text-dark dark:text-white">
                          {day}
                        </td>
                        <td className="py-4 px-4 text-dark dark:text-white">
                          <span className="text-blue">{sales.toLocaleString('fa-IR')}</span>
                        </td>
                        <td className="py-4 px-4 text-dark dark:text-white">
                          <span className="text-green">{revenue.toLocaleString('fa-IR')}</span>
                        </td>
                        <td className="py-4 px-4 text-dark dark:text-white">
                          {margin}%
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            {trend === 'up' && (
                              <svg className="fill-green" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3.5L17.5 11L15.79 12.71L11 7.91V17.5H9V7.91L4.21 12.71L2.5 11L10 3.5Z" />
                              </svg>
                            )}
                            {trend === 'down' && (
                              <svg className="fill-red" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 16.5L2.5 9L4.21 7.29L9 12.09V2.5H11V12.09L15.79 7.29L17.5 9L10 16.5Z" />
                              </svg>
                            )}
                            {trend === 'same' && (
                              <svg className="fill-gray-400" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 9H18V11H2V9Z" />
                              </svg>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-[10px] bg-gradient-to-br from-blue to-blue-dark p-7.5 shadow-1">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                  <svg className="fill-white" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-white/80">میانگین درآمد روزانه</h5>
                  <h3 className="mt-1 text-2xl font-bold text-white">
                    {averageRevenue.toLocaleString('fa-IR', { maximumFractionDigits: 0 })} تومان
                  </h3>
                </div>
              </div>
            </div>

            <div className="rounded-[10px] bg-gradient-to-br from-green to-green-dark p-7.5 shadow-1">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                  <svg className="fill-white" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13.41 18.09V19.67C13.41 20.03 13.12 20.33 12.76 20.33H11.23C10.87 20.33 10.58 20.03 10.58 19.67V18.09C9.05 17.83 7.78 16.91 7.47 15.37C7.42 15.09 7.63 14.83 7.92 14.83H9.28C9.5 14.83 9.69 14.99 9.76 15.2C9.95 15.75 10.52 16.25 11.74 16.25C13.28 16.25 13.63 15.5 13.63 15.08C13.63 14.5 13.28 13.92 11.42 13.54C9.22 13.08 7.58 12.25 7.58 10.25C7.58 8.58 8.92 7.5 10.58 7.17V5.67C10.58 5.3 10.87 5 11.23 5H12.76C13.12 5 13.41 5.3 13.41 5.67V7.17C14.76 7.42 15.75 8.25 16.08 9.58C16.13 9.83 15.92 10.08 15.67 10.08H14.42C14.21 10.08 14.03 9.95 13.95 9.75C13.72 9.17 13.23 8.75 12.16 8.75C10.88 8.75 10.41 9.33 10.41 10C10.41 10.58 10.88 11.08 12.5 11.42C14.12 11.75 16.45 12.42 16.45 15.08C16.41 16.75 15.17 17.83 13.41 18.09Z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-white/80">بیشترین فروش روزانه</h5>
                  <h3 className="mt-1 text-2xl font-bold text-white">
                    {profitData ? Math.max(...profitData.sales).toLocaleString('fa-IR') : 0} تومان
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </ProtectedRoute>
  );
}
