"use server";

import { signOut } from "@/auth";
import { cookies } from "next/headers";

export async function logout() {
  try {
    const cookie = await cookies();
    await signOut();
    cookie.delete("accessToken");
    cookie.delete("refreshToken");
  } catch (error) {
    console.log(error);
  }
}
