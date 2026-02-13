import AvatarStack from "@/components/avatar-stack";
import { Button } from "@/components/ui/button";
import { Camera, Edit, MoreHorizontal, PlusCircle } from "lucide-react";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import React from "react";
import Link from "./link";
import { auth } from "@/auth";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { cookies } from "next/headers";
import { IUser } from "@/types";
import CoverPhoto from "@/components/cover-photo";

const getProfile = async () => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieStore
          .getAll()
          .map((c) => `${c.name}=${c.value}`)
          .join("; "),
      },
      body: JSON.stringify({
        query: `
          query {
            me {
              id
              firstName
              lastName
              fullName
              username
              email
              profilePicture {
                url
                pub_id
              }
              coverPicture {
                url
                pub_id
              }
              bio
              followers {
                id
                firstName
                lastName
                fullName
                username
                profilePicture {
                  url
                  pub_id
                }
              }
            }
          }
        `,
      }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    notFound();
  }
};

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const {
    data: { me: user },
  }: { data: { me: IUser } } = await getProfile();

  const coverSrc = user?.coverPicture?.url ?? "/images/default-cover.jpeg";

  return (
    <div className=" min-h-screen mt-24 md:mt-12">
      {/* Cover Photo */}
      <div className="relative w-full h-[200px] md:h-[350px] bg-shade">
        <CoverPhoto
          containerClass="relative w-full h-[200px] md:h-[350px] bg-shade"
          imageClass="object-cover w-full h-full"
        >
          <Button
            size="sm"
            className="absolute bottom-4 right-4 bg-white text-black hover:bg-gray-200"
          >
            <Camera className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Edit Cover Photo</span>
          </Button>
        </CoverPhoto>
        {/* <Image
          src={"/images/default-cover.jpeg"}
          alt="Cover photo"
          fill
          className="object-cover w-full h-full"
        /> */}
        {/* <img src="/images/default-cover.jpeg" alt="test cover" /> */}
      </div>
      <div className="relative -mt-20 md:mt-0 bg-shade">
        <div className="w-full max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center py-4">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4  overflow-hidden ">
              <Avatar className="w-full h-full border">
                <AvatarImage
                  src={
                    user?.profilePicture?.url || "/images/default-profile.jpeg"
                  }
                />
                <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <Button
              size="sm"
              className="absolute bottom-2 right-0 rounded-full w-8 h-8 p-0"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          {/* Profile Info */}
          <div className="mt-4 md:mt-0 md:ml-4 flex-1 text-center flex md:flex-row flex-col justify-between items-center h-full">
            <div>
              <h1 className="text-2xl font-bold">{user?.fullName}</h1>
              <p className="text-sm text-muted-foreground">
                @{user?.username} · {0} followers
              </p>
              <div className="w-full flex justify-center items-center">
                {/* {user?.followers && user?.followers?.length > 0 && (
                  <AvatarStack users={users} limit={5} size="sm" />
                )} */}
              </div>
              <p className="text-sm mt-1">{user?.bio}</p>
            </div>
            <div className="flex gap-1 items-center">
              <Button className="flex-1 md:flex-auto">
                <PlusCircle className="h-4 w-4 mr-2" />
                <span>Add to Story</span>
              </Button>
              <Button variant="outline" className="flex-1 md:flex-auto">
                <Edit className="h-4 w-4 mr-2" />
                <span>Edit Profile</span>
              </Button>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        {/* Details and Navigation */}
        <div className="pt-4 pb-4">
          <div defaultValue="posts" className="mt-4 bg-">
            <nav className="sticky md:top-12 top-24 bg-shade border-b z-10 shadow-sm px-4">
              <ul className="w-full max-w-5xl mx-auto flex gap-3 items-center justify-start h-full py-2">
                {[
                  { id: 1, name: "Posts", href: `/${session?.user?.username}` },
                  {
                    id: 2,
                    name: "About",
                    href: `/${session?.user?.username}/about`,
                  },
                  {
                    id: 3,
                    name: "Friends",
                    href: `/${session?.user?.username}/friends`,
                  },
                  {
                    id: 4,
                    name: "Photos",
                    href: `/${session?.user?.username}/photos`,
                  },
                ].map((item) => (
                  <li key={item.id}>
                    <Link href={item.href}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default layout;
