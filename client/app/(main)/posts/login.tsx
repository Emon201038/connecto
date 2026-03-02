"use client";
import { Button } from "@/components/ui/button";
import { serverFetch } from "@/lib/server-fetch";
import { useRouter } from "next/navigation";
import React from "react";

const Login = () => {
  const router = useRouter();
  const handleClick = async () => {
    await serverFetch.post("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "fb1@example.com",
        password: "123456",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    router.refresh();
  };
  return <Button onClick={() => handleClick()}>Login</Button>;
};

export default Login;
