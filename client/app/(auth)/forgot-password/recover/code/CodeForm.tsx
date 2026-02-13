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

const CodeForm = () => {
  const selectMethodSchema = z.object({
    code: z
      .string({ error: "Code is required" })
      .min(6, "Code is required")
      .max(6, "Code must be 6 digits"),
  });

  const router = useRouter();

  const form = useForm<z.infer<typeof selectMethodSchema>>({
    resolver: zodResolver(selectMethodSchema),
    defaultValues: {
      code: "",
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
                We sent a 6-digit code to another device on which you&apos;re
                logged in. Enter the code below.
              </p>
              <RHFInput
                control={form.control}
                name={"code"}
                placeholder="Enter code"
              />
            </div>
          </CardContent>
          <Separator className="mt-4" />
          <div className="w-full p-4 gap-4 flex justify-between items-center">
            <p
              onClick={() => router.back()}
              className="text-xs text-primary cursor-pointer hover:underline"
            >
              Didn&apos;st get a code?
            </p>
            <div className="gap-4 flex justify-end items-center">
              <Button
                onClick={() => router.push(`/login`)}
                className="rounded-sm"
                type="button"
                variant={"outline"}
              >
                cancel
              </Button>
              <Button className="rounded-sm py-4">Continue</Button>
            </div>
          </div>
        </Card>
      </form>
    </Form>
  );
};

export default CodeForm;
