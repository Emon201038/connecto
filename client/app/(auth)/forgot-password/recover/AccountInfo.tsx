"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { IMatchedUser } from "./page";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { RHFRadio } from "@/components/rhf-radio";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSendResetCodeMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { is } from "date-fns/locale";

interface IProps {
  user: IMatchedUser;
}

const AccountInfo = ({ user }: IProps) => {
  const selectMethodSchema = z.object({
    method: z.enum(
      user.methods.map((method) => method.type),
      { error: "Method is required" }
    ),
  });

  const router = useRouter();
  const params = useSearchParams();

  const form = useForm<z.infer<typeof selectMethodSchema>>({
    resolver: zodResolver(selectMethodSchema),
    defaultValues: {
      method: user.methods.find((method) => method.disabled === false)?.type,
    },
  });

  const [sendOtp, { isLoading: isResendLoading }] = useSendResetCodeMutation();

  const handleSubmit = async (data: z.infer<typeof selectMethodSchema>) => {
    try {
      const res = await sendOtp({
        email: params?.get("email") as string,
        id: params?.get("id") as string,
      }).unwrap();
      if (res.data?.sendResetCode) {
        router.push(
          `/forgot-password/recover/code?method=${data.method}&o_id=${res?.data?.sendResetCode}`
        );
      } else {
        toast.error("Failed to send otp" + res.errors[0].message);
      }
    } catch (error) {
      toast.error("Failed to send otp");
    }
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
              <div className="grid grid-cols-5">
                <div className="col-span-3 space-y-4">
                  <p>
                    How do you want to receive the code to reset your password?
                  </p>
                  <RHFRadio
                    control={form.control}
                    name="method"
                    options={user.methods.map((method) => ({
                      label: method.label,
                      value: method.type,
                      description: method.description,
                      disabled: method.disabled,
                    }))}
                  />
                </div>
                <div className="col-span-2 flex flex-col w-full h-full justify-center items-center">
                  <Avatar className="w-[60px] h-[60px]">
                    <AvatarFallback>
                      {user.user.fullName?.[0]?.toUpperCase()}
                    </AvatarFallback>
                    <AvatarImage
                      src={
                        user.user.profilePicture?.url ||
                        "/images/default-profile.jpeg"
                      }
                    />
                  </Avatar>
                  <h1>{user.user.fullName}</h1>
                </div>
              </div>
            </div>
          </CardContent>
          <Separator />
          <div className="w-full p-4 gap-4 flex justify-end items-center">
            <Button
              onClick={() => router.push(`/login`)}
              className="rounded-sm"
              type="button"
              variant={"outline"}
            >
              cancel
            </Button>
            <Button disabled={isResendLoading} className="rounded-sm py-4">
              {isResendLoading ? "Sending..." : "Continue"}
            </Button>
          </div>
        </Card>
      </form>
    </Form>
  );
};

export default AccountInfo;
