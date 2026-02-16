"use client";
import { RHFDate } from "@/components/rhf-date";
import { RHFInput } from "@/components/rhf-input";
import { RHFRadio } from "@/components/rhf-radio";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { IUser } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface Props {}

const signupSchema = z.object({
  firstName: z
    .string({ error: "First name is required" })
    .min(1, "First name is required"),
  lastName: z
    .string({ error: "Last name is required" })
    .min(1, "Last name is required"),
  email: z.string({ error: "Email is required" }).min(1, "Email is required"),
  phone: z
    .string({ error: "Phone number is required" })
    .min(1, "Phone number is required"),
  dateOfBirth: z.date({ error: "Date of birth is required" }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], { error: "Gender is required" }),
  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required"),
});

const SignupForm: React.FC<Props> = ({ user }: { user?: IUser }) => {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      email: user?.email || "",
      dateOfBirth: user?.dateOfBirth
        ? new Date(parseInt(user.dateOfBirth))
        : new Date(),
      gender: user?.gender || "MALE",
      password: "",
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callback");
  const [error, setError] = React.useState<string | null>(null);
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const handleNavigate = (url = "/") => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    router.push(`${url}?${current.toString()}`);
  };

  const handleSubmit = async (data: z.infer<typeof signupSchema>) => {
    try {
      const res = await register(data).unwrap();
      if (!res.data.register) {
        toast.error("Failed to sign up", {
          description: res.errors[0].message,
        });
        return;
      }

      const loginRes = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      // I want to send additional api call to set cookie. How could I get response from next auth
      if (loginRes?.error) {
        toast.error(loginRes?.error);
      } else {
        if (callbackUrl && callbackUrl.startsWith("/")) {
          router.push(callbackUrl);
        } else router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to sign up");
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <RHFInput
            control={form.control}
            name={"firstName"}
            label="First name"
            placeholder="First name"
          />
          <RHFInput
            control={form.control}
            name={"lastName"}
            label="Last name"
            placeholder="Last name"
          />
        </div>
        <RHFInput
          control={form.control}
          name={"email"}
          label="Email"
          placeholder="Enter your email number"
          type="email"
        />
        <RHFInput
          control={form.control}
          name={"password"}
          label="New Password"
          placeholder="Enter your password number"
          type="password"
        />
        <div className="grid grid-cols-2 gap-4">
          <RHFDate
            control={form.control}
            name={"dateOfBirth"}
            placeholder="Date of birth"
            label="Date of birth"
          />
          <RHFInput
            control={form.control}
            name={"phone"}
            label="Phone"
            placeholder="Enter your phone number"
          />
        </div>

        <RHFRadio
          control={form.control}
          name={"gender"}
          label="Gender"
          options={[
            { label: "Male", value: "MALE" },
            { label: "Female", value: "FEMALE" },
          ]}
          containerClassName="grid grid-cols-3 gap-3 justify-center items-center w-full"
          itemClassName="w-full border rounded p-2"
        />

        <div className="text-xs text-muted-foreground">
          By clicking Sign Up, you agree to our Terms, Privacy Policy and
          Cookies Policy.
        </div>

        <Alert variant="default">
          <AlertCircleIcon />
          <AlertTitle>Account verification is disabled now.</AlertTitle>
          <AlertDescription>
            <p>
              You can create a new account without verification. Just enter your
              email and password and necessary information. In future we will
              enable account verification.
            </p>
          </AlertDescription>
        </Alert>

        <Button
          type="submit"
          className="w-full bg-primary text-primary-text hover:bg-primary/80"
          disabled={isRegisterLoading}
        >
          {isRegisterLoading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
