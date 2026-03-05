import { IUser } from "@/types";
import { serverFetch } from "./server-fetch";
import { store } from "@/redux/store";
import { authApi } from "@/redux/features/auth/authApi";

export const auth = async () => {
  try {
    const res = await store.dispatch(authApi.endpoints.me.initiate());

    return res?.data as IUser;
  } catch (error) {
    console.log(error);
    return null;
  }
};
