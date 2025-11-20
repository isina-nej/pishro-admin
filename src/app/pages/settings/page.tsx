import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import SettingBoxes from "@/components/SettingBoxes";
import ZarinpalSettings from "@/components/ZarinpalSettings";

export const metadata: Metadata = {
  title: "Next.js Settings Page | pishro - Next.js Dashboard c",
  description: "This is Next.js Settings page for pishro Dashboard Kit"
};

const Settings = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb pageName="تنظیمات" />

        <div className="mb-8">
          <ZarinpalSettings />
        </div>

        <SettingBoxes />
      </div>
    </DefaultLayout>);

};

export default Settings;