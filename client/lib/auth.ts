import { IUser } from "@/types";
import { serverFetch } from "./server-fetch";

export const auth = async () => {
  try {
    const res = await serverFetch.get("/api/v2/auth/me", {
      credentials: "include",
    });
    const data = await res.json();

    return data?.data as IUser;
  } catch (error) {
    console.log(error);
    return null;
  }
};
