import Link from "next/link";
import React from "react";
import LoginForm from "./LoginForm";
import Logo from "@/components/icons/logo";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Image from "next/image";

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ callback?: string }>;
}) => {
  const session = await auth();
  const params = await searchParams;
  const callback = params?.callback;
  if (session?.user?.id) {
    redirect(callback && callback.startsWith("/") ? callback : "/");
  }
  return (
    <div className="min-h-screen  flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col justify-center items-center gap-1">
        <Image
          src={"/images/connecto-short-logo.png"}
          alt="Logo"
          width={80}
          height={80}
          className="size-20"
        />
        <h2 className="text-center text-3xl font-extrabold">
          Log in to Connecto
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="dark:bg-accent py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm />

          <div className="mt-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-accent text-gray-500">or</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3">
              <Link
                href="/sign-up"
                className="w-full inline-flex justify-center py-2 px-4  rounded-md shadow-sm bg-green-500 text-sm font-medium text-white hover:bg-green-600"
              >
                Create New Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
