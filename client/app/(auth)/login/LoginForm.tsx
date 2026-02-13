"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { RHFInput } from "@/components/rhf-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { handleLogin } from "./action";
import { signIn } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageSquareWarningIcon } from "lucide-react";

const loginPageSchema = z.object({
  email: z
    .string({ error: "email number is required" })
    .min(1, "email number is required"),
  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required"),
});

interface Props {}

const LoginForm: React.FC<Props> = () => {
  const form = useForm({
    resolver: zodResolver(loginPageSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callback");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (data: z.infer<typeof loginPageSchema>) => {
    setIsLoading(true);
    try {
      setError(null);
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      // I want to send additional api call to set cookie. How could I get response from next auth
      if (res?.error) {
        setError(res?.error);
      } else {
        if (callbackUrl && callbackUrl.startsWith("/")) {
          router.push(callbackUrl);
        } else router.push("/");
      }
    } catch (error) {
      setError((error as any)?.data?.message || error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (url = "/") => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    router.push(`${url}?${current.toString()}`);
  };

  const userLogin = () => {
    form.setValue("email", process.env.NEXT_PUBLIC_USER_EMAIL as string);
    form.setValue("password", process.env.NEXT_PUBLIC_USER_PASSWORD as string);
  };

  const adminUserLogin = () => {
    form.setValue("email", process.env.NEXT_PUBLIC_ADMIN_EMAIL as string);
    form.setValue("password", process.env.NEXT_PUBLIC_ADMIN_PASSWORD as string);
  };

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(handleSubmit)}>
        <RHFInput
          control={form.control}
          name={"email"}
          label="Email or Phone"
          placeholder="Enter your email or number"
        />

        <RHFInput
          control={form.control}
          name={"password"}
          type="password"
          label="Password"
          placeholder="Enter your password"
        />
        <p className="text-red-500 text-sm w-full">
          {error ? "Invalid credentials" : null}
        </p>
        <Button
          disabled={isLoading}
          className="w-full dark:text-accent-foreground"
        >
          {isLoading ? "please wait..." : "Login"}
        </Button>
        <div
          onClick={() => handleNavigate("/forgot-password")}
          className="w-full text-primary dark:text-blue-400 text-sm tracking-tighter hover:underline flex justify-center items-center cursor-pointer"
        >
          Forgot Password?
        </div>

        <Alert variant="default">
          <MessageSquareWarningIcon />
          <AlertTitle>For Testing only!</AlertTitle>
          <AlertDescription className="w-full">
            <p>Please, do not missuse this form for testing purposes.</p>
            <div className="flex flex-wrap justify-center items-center gap-2 w-full">
              <Button
                type="button"
                onClick={userLogin}
                variant={"outline"}
                className="w-full cursor-pointer"
              >
                User Login
              </Button>
              <Button
                type="button"
                onClick={adminUserLogin}
                variant={"outline"}
                className="w-full cursor-pointer"
              >
                Admin Login
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </form>
    </Form>
  );
};

export default LoginForm;
