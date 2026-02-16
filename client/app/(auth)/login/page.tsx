import Link from "next/link";
import LoginForm from "./LoginForm";
import Image from "next/image";
import { Suspense } from "react";

const LoginPage = () => {
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
          <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
          </Suspense>

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
                className="w-full inline-flex justify-center py-2 px-4  rounded-md shadow-sm bg-muted border text-sm font-medium hover:bg-background"
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
