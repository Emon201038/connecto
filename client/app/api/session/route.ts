// app/api/session/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    method: "POST",
    body: JSON.stringify({
      query: `
        query Me{
          me{
            firstName
            lastName
            fullName
            id
            profilePicture {
              pub_id
              url
            }
          }
        }
      `,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ user: null }, { status: res.status });
  }

  const user = await res.json();
  return NextResponse.json({ user });
}
