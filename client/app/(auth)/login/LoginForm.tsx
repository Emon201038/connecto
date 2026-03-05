"use client";
import React, { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageSquareWarningIcon } from "lucide-react";
import { login } from "@/services/auth/auth.service";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InputFieldError from "@/components/shared/InputFieldError";
import { IInputErrorState } from "@/lib/getInputFieldError";
import { toast } from "sonner";

interface Props {}

const LoginForm: React.FC<Props> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = React.useRef<HTMLFormElement>(null);

  const [data, loginAction, isPending] = useActionState(login, null);

  const handleNavigate = (url = "/") => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    router.push(`${url}?${current.toString()}`);
  };

  const userLogin = () => {
    const emailInput = formRef.current?.querySelector(
      "input[name='email']",
    ) as HTMLInputElement;

    const passwordInput = formRef.current?.querySelector(
      "input[name='password']",
    ) as HTMLInputElement;

    if (emailInput && passwordInput) {
      emailInput.value = process.env.NEXT_PUBLIC_USER_EMAIL as string;
      passwordInput.value = process.env.NEXT_PUBLIC_USER_PASSWORD as string;
    }
  };

  const adminUserLogin = () => {
    const emailInput = formRef.current?.querySelector(
      "input[name='email']",
    ) as HTMLInputElement;

    const passwordInput = formRef.current?.querySelector(
      "input[name='password']",
    ) as HTMLInputElement;

    if (emailInput && passwordInput) {
      emailInput.value = process.env.NEXT_PUBLIC_ADMIN_EMAIL as string;
      passwordInput.value = process.env.NEXT_PUBLIC_ADMIN_PASSWORD as string;
    }
  };

  useEffect(() => {
    if (data?.errors?.length === 0 && !data?.success) {
      toast.error(data?.message);
    }
  }, [data]);

  return (
    <form ref={formRef} className="space-y-3" action={loginAction}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="text"
          placeholder="Enter your email or phone"
          name="email"
          defaultValue={data?.formData?.email || undefined}
        />
        <InputFieldError state={data as IInputErrorState} field={"email"} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="********"
          name="password"
          defaultValue={data?.formData?.password || undefined}
        />
        <InputFieldError state={data as IInputErrorState} field={"password"} />
      </div>
      <Button
        disabled={isPending}
        className="w-full dark:text-accent-foreground"
      >
        {isPending ? "please wait..." : "Login"}
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
  );
};

export default LoginForm;
