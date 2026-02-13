import type React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignupForm from "./SignupForm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ callback?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const callback = params?.callback;
  if (session?.user?.id) {
    redirect(callback && callback.startsWith("/") ? callback : "/");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 dark:bg-transparent px-4 py-8">
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <div className="text-center md:text-left mb-8">
            <h1 className="text-blue-600 text-5xl md:text-6xl font-bold">
              Connecto
            </h1>
            <p className="text-xl md:text-2xl mt-4">
              Sign up to connect with friends, family and communities of
              interest.
            </p>
          </div>
        </div>

        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>It&apos;s quick and easy.</CardDescription>
            </CardHeader>
            <CardContent>
              <SignupForm />
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link href="/login" className="text-blue-600 hover:underline">
                Already have an account?
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
