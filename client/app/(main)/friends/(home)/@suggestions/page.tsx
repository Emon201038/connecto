import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { friendApi } from "@/redux/features/friend/friendApi";
import { store } from "@/redux/store";
import { MoreHorizontal, UserPlus } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import AddFriendButton from "./add-friend-button";
import FriendCard from "../../components/friend-card";
import Link from "next/link";

const page = async () => {
  const session = await auth();
  if (!session) return redirect("/login?callback=/friends");

  const cookieStore = await cookies();
  const cookieList = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  const suggestedRes = await store.dispatch(
    friendApi.endpoints.getSuggestedUsers.initiate({ cookie: cookieList })
  );

  const suggested = suggestedRes?.data?.data?.users || [];
  return (
    <div className="mt-12">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-4">People You May Know</h2>
        <Link href={"/friends/suggestions"} className="text-primary underline">
          See All
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {suggested.length > 0 ? (
          suggested.map((suggestion, index) => (
            <FriendCard friend={suggestion} key={index}>
              <div className="flex gap-2 justify-center">
                <AddFriendButton userId={suggestion.id} />
                <Button size="sm" variant="ghost" className="px-2">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </FriendCard>
          ))
        ) : (
          <div>No suggestion available</div>
        )}
      </div>
    </div>
  );
};

export default page;
