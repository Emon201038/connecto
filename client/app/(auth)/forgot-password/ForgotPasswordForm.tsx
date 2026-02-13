import { RHFInput } from "@/components/rhf-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { IAccount } from "./page";
import { useRouter } from "next/navigation";
import { useLazyGetUsersQuery } from "../../../redux/features/user/userApi";
import PickAccountLoading from "./PickAccountLoading";

const forgotPasswordSchema = z.object({
  credential: z
    .string({ error: "Email or phone number is required" })
    .min(1, "Email or phone number is required"),
});

interface IProps {
  setIsSearched: React.Dispatch<React.SetStateAction<boolean>>;
  setAccounts: React.Dispatch<React.SetStateAction<IAccount[]>>;
}

const ForgotPasswordForm = ({ setIsSearched, setAccounts }: IProps) => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      credential: "",
    },
  });

  const [searchUsers, { isLoading }] = useLazyGetUsersQuery();

  const handleSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    try {
      const res = await searchUsers({ search: data.credential }).unwrap();
      setAccounts(res.data.users as unknown as IAccount[]);
    } catch (error) {
    } finally {
      setIsSearched(true);
    }
  };

  if (isLoading) return <PickAccountLoading />;
  return (
    <Card className="p-0 gap-0 w-full max-w-md">
      <h1 className="leading-none font-semibold p-[18px]">Find your account</h1>
      <Separator />
      <CardContent className="px-0 py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="">
            <div className="px-4 space-y-3 mb-4">
              <p>
                Please enter your email address or mobile number to search for
                your account.
              </p>
              <RHFInput
                control={form.control}
                name={"credential"}
                placeholder="Email address or mobile number"
                inputclassname="p-4 pr-0 h-12"
              />
            </div>
            <Separator />
            <div className="w-full p-4 pb-0 gap-4 flex justify-end items-center">
              <Button
                onClick={() => router.push(`/login`)}
                className="rounded-sm"
                type="button"
                variant={"outline"}
              >
                cancel
              </Button>
              <Button className="rounded-sm py-4">Search</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
