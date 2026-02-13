import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import NewPasswordForm from "./NewPasswordForm";

const page = async () => {
  const head = await headers();
  const referer = head.get("referer");

  // Only allow if came from your /code route
  if (!referer || !referer.includes("/code")) {
    redirect("/"); // or show 404
  }
  return (
    <div className="min-h-screen bg-[rgb(232,234,237)] flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <NewPasswordForm />
    </div>
  );
};

export default page;
