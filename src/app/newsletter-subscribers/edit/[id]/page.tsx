"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import NewsletterSubscriberForm from "@/components/NewsletterSubscribers/NewsletterSubscriberForm";

const EditNewsletterSubscriberPage = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش مشترک خبرنامه" />
      <NewsletterSubscriberForm subscriberId={id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditNewsletterSubscriberPage;
