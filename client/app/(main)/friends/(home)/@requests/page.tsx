import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { friendApi } from "@/redux/features/friend/friendApi";
import { store } from "@/redux/store";
import { cookies } from "next/headers";
import React from "react";
import { AcceptButton, DeclineButton } from "./Button";
import FriendCard from "../../components/friend-card";
import Link from "next/link";

const page = async () => {
  const cookieStore = await cookies();
  const cookieList = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await store.dispatch(
    friendApi.endpoints.pendingRequests.initiate({ cookie: cookieList })
  );

  const requests = res?.data?.data?.pendingRequests || [];
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          Friend Requests
          {requests.length > 0 && (
            <Badge variant="secondary">{requests.length}</Badge>
          )}
        </h2>
        <Link href={"/friends/requests"} className="text-primary underline">
          See All
        </Link>
      </div>
      {requests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {requests.map(({ user: request, friendshipId }) => (
            <FriendCard friend={request} key={friendshipId}>
              <div className="flex flex-row md:flex-col gap-2 mt-2 w-full">
                <AcceptButton id={friendshipId} />
                <DeclineButton id={friendshipId} />
              </div>
            </FriendCard>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No friend requests</p>
      )}
    </div>
  );
};

export default page;
