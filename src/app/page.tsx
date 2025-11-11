'use client';

import ECommerce from "@/components/Dashboard/E-commerce";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { ProtectedRoute } from "@/components/protected-route";
import React from "react";

export default function Home() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <DefaultLayout>
        <ECommerce />
      </DefaultLayout>
    </ProtectedRoute>
  );
}
