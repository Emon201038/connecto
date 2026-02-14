import { baseApi } from "@/redux/baseApi";
import { IResponse } from "@/types";

export const otpApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    verify2FA: builder.mutation<
      IResponse<boolean>,
      { s_id: string; o_id: string; token: string }
    >({
      query: (credentials) => ({
        url: "/",
        method: "POST",
        body: {
          query: `
            mutation Verify2FA($s_id: String!,$o_id:String!,$token: String!) {
              verify2FA(s_id: $s_id, o_id: $o_id, token: $token)
          }`,
          variables: credentials,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    sendOtp: builder.mutation<
      IResponse<{ s_id: string; o_id: string }>,
      { s_id: string; type: string }
    >({
      query: (credentials) => ({
        url: "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `mutation sendOtp($s_id: String!,$type:String! ) {
            sendOtp(s_id: $s_id, type: $type) {
              s_id
              o_id
            }
          }`,
          variables: credentials,
        }),
      }),
      transformResponse: (r: {
        data: { sendOtp: { s_id: string; o_id: string } };
        errors: { message: string }[];
      }) => {
        return {
          data: r.data.sendOtp,
          errors: r.errors,
        };
      },
    }),
  }),
});

export const { useVerify2FAMutation, useSendOtpMutation } = otpApi;
