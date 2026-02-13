"use client";
import React from "react";
import ForgotPasswordForm from "./ForgotPasswordForm";
import PickAccount from "./PickAccount";
import { useLazyGetUsersQuery } from "@/redux/features/user/userApi";

export interface IAccount {
  id: string;
  fullName: string;
  email: string;
  profilePicture: {
    url: string;
    public_id: string;
  } | null;
}
const Page = () => {
  const [isSearched, setIsSearched] = React.useState(false);
  const [accounts, setAccounts] = React.useState<IAccount[]>([]);

  const [searchUsers, { isLoading }] = useLazyGetUsersQuery();

  const handleSearch = async () => {
    try {
      const res = await searchUsers({ search: "" }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen  bg-[rgb(232,234,237)] dark:bg-transparent flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      {!isSearched ? (
        <ForgotPasswordForm
          setIsSearched={setIsSearched}
          setAccounts={setAccounts}
        />
      ) : (
        <PickAccount
          accounts={accounts}
          setAccounts={setAccounts}
          setIsSearched={setIsSearched}
        />
      )}
    </div>
  );
};

export default Page;
