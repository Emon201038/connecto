"use client";
import { RHFInput } from "@/components/rhf-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSaveLoginInfoMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import {
  useSendOtpMutation,
  useVerify2FAMutation,
} from "@/redux/features/otp/otpApi";

const formSchema = z.object({
  token: z
    .string({ message: "Code is required" })
    .min(1, "Code is required")
    .min(6, "Code must be 6 digits")
    .max(6, "Code must be 6 digits"),
  s_id: z
    .string({ message: "s_id is required" })
    .regex(/^[a-fA-F0-9]{24}/, "s_id is invalid"),
  o_id: z
    .string({ message: "o_id is required" })
    .regex(/^[a-fA-F0-9]{24}/, "o_id is invalid"),
});

const RESEND_INTERVAL = 120; // 2 minutes

const TwoFactorForm = ({ s_id, o_id }: { s_id: string; o_id: string }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: "",
      s_id,
      o_id,
    },
  });
  const [sessionId, setSessionId] = useState("");
  const [otpId, setOtpId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [verify, { isLoading }] = useVerify2FAMutation();
  const [resendOtp, { isLoading: isResendLoading }] = useSendOtpMutation();
  const [saveLoginInfo, { isLoading: isSaveLoginInfoLoading }] =
    useSaveLoginInfoMutation();

  const [timer, setTimer] = useState(0);
  const [showDialog, setShowDialog] = useState(false);

  // Countdown effect for resend
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setError(null);
      const res = await verify(data).unwrap();

      if (res?.errors?.length > 0) {
        setError(res.errors[0].message);
        return;
      }

      // simulate server verification
      if (res?.data) {
        setShowDialog(true);
      } else {
        setError(res?.errors[0].message || "Failed to verify code");
      }
    } catch (error) {
      setError((error as any).data.message || error);
    }
  };

  const handleResend = async () => {
    try {
      if (isResendLoading) {
        return;
      }
      const res = await resendOtp({ s_id, type: "two_factor" }).unwrap();
      if (res.errors?.length > 0) {
        toast.error("Failed to re-send otp", {
          description: res.errors[0].message,
        });
        return;
      }

      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set("s_id", res.data.s_id);
      current.set("o_id", res.data.o_id);

      setOtpId(res.data.o_id);
      setSessionId(res.data.s_id);
      form.setValue("o_id", res.data.o_id);
      form.setValue("s_id", res.data.s_id);

      router.push(`?${current.toString()}`);

      toast.success("otp re-send successfully");
      setTimer(RESEND_INTERVAL);
    } catch (error) {
      toast.error(
        (error as any).data.errors?.[0]?.message ||
          (error as any)?.message ||
          error
      );
    }
  };

  const saveLogin = async () => {
    try {
      await saveLoginInfo({ sessionId: s_id }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Card className="p-0 gap-0 w-full max-w-md rounded-sm">
            <h1 className="leading-none font-semibold p-[18px]">
              Two-factor authentication required
            </h1>
            <Separator />
            <CardContent className="px-0 pt-4">
              <div className="px-4 space-y-4">
                <p>
                  You have asked us to require a 6-digit login code when anyone
                  tries to access your account from a new device or browser.
                  <br />
                  When you receive your 6-digit code, enter it to continue.
                </p>
                <RHFInput
                  control={form.control}
                  name="token"
                  placeholder="Enter login code"
                />
                <p className="text-red-500 text-sm ">{error || ""}</p>
              </div>
            </CardContent>
            <Separator className="mt-4 " />
            <div className="w-full p-4 gap-4 flex justify-between items-center">
              {timer > 0 ? (
                <div className="text-sm text-muted-foreground">
                  Resend available in {Math.floor(timer / 60)}:
                  {(timer % 60).toString().padStart(2, "0")}
                </div>
              ) : (
                <div
                  className="text-sm text-primary underline cursor-pointer"
                  onClick={handleResend}
                >
                  {isResendLoading ? "sending code..." : "Resend code"}
                </div>
              )}
              <Button
                disabled={isLoading}
                type="submit"
                className="rounded-sm py-4"
              >
                {isLoading ? "Loading..." : "Continue"}
              </Button>
            </div>
          </Card>
        </form>
      </Form>

      {/* Alert Dialog after successful login */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save login info?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want us to save your login info on this device so you don’t
              have to enter a code next time?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => router.push("/")}>
              Not Now
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                saveLogin();
                router.push("/");
              }}
            >
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TwoFactorForm;
