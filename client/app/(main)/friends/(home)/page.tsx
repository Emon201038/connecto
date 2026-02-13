import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, MoreHorizontal } from "lucide-react";
import { cookies } from "next/headers";
import { store } from "@/redux/store";
import { friendApi } from "@/redux/features/friend/friendApi";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FriendCard from "../components/friend-card";
import Link from "next/link";

export default async function FriendsPage() {
  const session = await auth();
  if (!session) return redirect("/login?callback=/friends");

  const cookieStore = await cookies();
  const cookieList = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const friendsRes = await store.dispatch(
    friendApi.endpoints.myFriends.initiate({ cookie: cookieList })
  );

  const friends = friendsRes?.data?.data?.myFriends || [];

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-4">All Friends</h2>
        <Link href={"/friends/list"} className="text-primary underline">
          See All
        </Link>
      </div>
      {friends.length > 0 ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4
         xl:grid-cols-5
         gap-4"
        >
          {friends.map(({ user: friend, friendshipId }) => (
            <FriendCard friend={friend} key={friendshipId}>
              <div className="flex gap-2 justify-center">
                <Button
                  size={"sm"}
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Message
                </Button>
                <Button size={"sm"} variant="ghost" className="px-2">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </FriendCard>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No friends</p>
      )}
    </div>
  );
}
