"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

export const handleLogin = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const res = await signIn("credentials", {
      ...credentials,
      redirect: false,
    });
    revalidatePath("/");
    return res;
  } catch (error) {
    console.log(error, "error");
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid credentials",
          };

        default:
          return {
            error: "Something went wrong",
          };
      }
    }
    // throw error;
    return {
      error: "Something went wrong",
    };
  }
};
