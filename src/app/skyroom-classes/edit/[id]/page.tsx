"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import SkyRoomClassForm from "@/components/SkyRoomClasses/SkyRoomClassForm";
import { useParams } from "next/navigation";

const EditSkyRoomClassPage = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش کلاس Skyroom" />
      <SkyRoomClassForm classId={id} isEdit={true} />
    </DefaultLayout>
  );
};

export default EditSkyRoomClassPage;
