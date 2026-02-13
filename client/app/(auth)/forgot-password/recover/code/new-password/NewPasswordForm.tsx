"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { RHFInput } from "@/components/rhf-input";

const NewPasswordForm = () => {
  const selectMethodSchema = z.object({
    newPassword: z
      .string({ error: "password is required" })
      .min(6, "password is must be 6 digits")
      .max(6, "password must be 6 digits"),
    confirmPassword: z
      .string({ error: "password is required" })
      .min(6, "password is must be 6 digits")
      .max(6, "password must be 6 digits"),
  });

  const router = useRouter();

  const form = useForm<z.infer<typeof selectMethodSchema>>({
    resolver: zodResolver(selectMethodSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof selectMethodSchema>) => {
    router.push(`/forgot-password/recover/code/new-password`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card className="p-0 gap-0 w-full max-w-md">
          <h1 className="leading-none font-semibold p-[18px]">
            Reset your password
          </h1>
          <Separator />
          <CardContent className="px-0 pt-4">
            <div className="px-4 space-y-4">
              <p className="text-[15px]">
                Now its time to reset your password. Remember this password so
                that you can login.
              </p>
              <RHFInput
                type="password"
                control={form.control}
                name={"newPassword"}
                placeholder="Enter new password"
                label="New Password"
              />
              <RHFInput
                type="password"
                control={form.control}
                name={"confirmPassword"}
                placeholder="Enter confirm password"
                label="Confirm Password"
              />
            </div>
          </CardContent>
          <Separator className="mt-4" />
          <div className="w-full p-4 gap-4 flex justify-end items-center">
            <div className="gap-4 flex justify-end items-center">
              <Button
                onClick={() => router.push(`/login`)}
                className="rounded-sm"
                type="button"
                variant={"outline"}
              >
                cancel
              </Button>
              <Button className="rounded-sm py-4">Save</Button>
            </div>
          </div>
        </Card>
      </form>
    </Form>
  );
};

export default NewPasswordForm;
