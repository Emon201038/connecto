"use client";
import React from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      // const res = await logout();
      // if (res) {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/login");
      // } else {
      // toast.error("Failed to logout");
      // }
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant={"ghost"}
      className="w-full justify-start p-0  font-semibold"
    >
      <div className="size-7 bg-[#e2e5eb] rounded-full flex justify-center items-center">
        <LogOut size={20} />
      </div>
      <span>Log out</span>
    </Button>
  );
};

export default LogoutButton;
