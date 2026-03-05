import { serverFetch } from "@/lib/server-fetch";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await serverFetch.get(`/auth/me`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return NextResponse.json(null, { status: res.status });
  }

  const data = await res.json();
  const user = data?.data;
  return NextResponse.json(user, { status: res.status });
}
