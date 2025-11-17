import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import LessonForm from "@/components/Lessons/LessonForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "افزودن درس جدید | پنل ادمین پیشرو",
  description: "افزودن درس جدید به دوره آموزشی",
};

const CreateLessonPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="افزودن درس جدید" />

      <div className="flex flex-col gap-10">
        <LessonForm />
      </div>
    </DefaultLayout>
  );
};

export default CreateLessonPage;
