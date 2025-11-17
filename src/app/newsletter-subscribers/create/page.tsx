import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import NewsletterSubscriberForm from "@/components/NewsletterSubscribers/NewsletterSubscriberForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "افزودن مشترک جدید | پنل ادمین پیشرو",
  description: "افزودن مشترک جدید به خبرنامه",
};

const CreateNewsletterSubscriberPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="افزودن مشترک جدید" />

      <div className="flex flex-col gap-10">
        <NewsletterSubscriberForm />
      </div>
    </DefaultLayout>
  );
};

export default CreateNewsletterSubscriberPage;
