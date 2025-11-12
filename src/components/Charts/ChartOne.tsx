"use client";

import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import DefaultSelectOption from "@/components/SelectOption/DefaultSelectOption";
import { useDashboardPayments } from "@/hooks/api/use-dashboard";

const ChartOne: React.FC = () => {
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

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#5750F1", "#0ABEF9"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 320,
          },
        },
      },
    ],

    stroke: {
      curve: "smooth",
    },

    markers: {
      size: 0,
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
      fixed: {
        enabled: !1,
      },
      x: {
        show: !1,
      },
      y: {
        title: {
          formatter: function (e) {
            return "";
          },
        },
      },
      marker: {
        show: !1,
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
      title: {
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  if (error) {
    return (
      <div className="col-span-12 rounded-[10px] bg-red-50 p-6 text-center xl:col-span-7">
        <p className="text-red-600">خطا در بارگذاری داده‌های پرداخت</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7">
      <div className="mb-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            مرور پرداخت‌ها
          </h4>
        </div>
        <div className="flex items-center gap-2.5">
          <p className="font-medium uppercase text-dark dark:text-dark-6">
            مرتب‌سازی بر اساس:
          </p>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'monthly' | 'yearly')}
            className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 font-medium outline-none"
          >
            <option value="monthly">ماهانه</option>
            <option value="yearly">سالانه</option>
          </select>
        </div>
      </div>
      <div>
        <div className="-ml-4 -mr-5">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 text-center xsm:flex-row xsm:gap-0">
        <div className="border-stroke dark:border-dark-3 xsm:w-1/2 xsm:border-r">
          <p className="font-medium">مبلغ دریافتی</p>
          <h4 className="mt-1 text-xl font-bold text-dark dark:text-white">
            {paymentsData?.totalReceived.toLocaleString('fa-IR')} تومان
          </h4>
        </div>
        <div className="xsm:w-1/2">
          <p className="font-medium">مبلغ معوق</p>
          <h4 className="mt-1 text-xl font-bold text-dark dark:text-white">
            {paymentsData?.totalDue.toLocaleString('fa-IR')} تومان
          </h4>
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
