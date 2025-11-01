import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CalendarBox from "@/components/CalenderBox";

export const metadata: Metadata = {
  title: "Next.js Calender Page | pishro - Next.js Dashboard Kit",
  description:
  "This is Next.js Calender page for pishro  Tailwind CSS Admin Dashboard Kit"
  // other metadata
};

const CalendarPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="تقویم" />

        <CalendarBox />
      </div>
    </DefaultLayout>);

};

export default CalendarPage;