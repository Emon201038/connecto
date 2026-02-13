import { notFound } from "next/navigation";
import React from "react";
import TwoFactorForm from "./TwoFactorForm";

export const metadata = {
  title: "2-factor authentication",
};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ s_id: string; o_id: string }>;
}) => {
  // const head = await headers();
  // const referer = head.get("referer");

  // Only allow if came from your /code route
  // if (!referer || !referer.includes("/login")) {
  //   redirect("/"); // or show 404
  // }

  const { s_id, o_id } = await searchParams;

  const isValids_Id =
    s_id && s_id.length === 24 && /^[0-9a-fA-F]{24}$/.test(s_id);
  const isValido_id =
    o_id && o_id.length === 24 && /^[0-9a-fA-F]{24}$/.test(o_id);
  if (!isValids_Id || !isValido_id) return notFound();

  return (
    <div className="min-h-screen  bg-[rgb(232,234,237)] flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <TwoFactorForm o_id={o_id} s_id={s_id} />
    </div>
  );
};

export default page;
