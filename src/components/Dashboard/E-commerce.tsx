"use client";
import React from "react";
import dynamic from 'next/dynamic';
import DataStatsOne from "@/components/DataStats/DataStatsOne";

const ChartOne = dynamic(() => import("@/components/Charts/ChartOne"), { ssr: false });
const ChartTwo = dynamic(() => import("../Charts/ChartTwo"), { ssr: false });
const ChartThree = dynamic(() => import("../Charts/ChartThree"), { ssr: false });

const ECommerce: React.FC = () => {
  return (
    <>
      <DataStatsOne />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
      </div>
    </>
  );
};

export default ECommerce;
