"use client";

import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import BookForm from "@/components/Books/BookForm";

const EditBookPage = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش کتاب" />
      <BookForm bookId={id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditBookPage;
