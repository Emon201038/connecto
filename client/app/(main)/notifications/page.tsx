import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import defaultImage from "@/../public/images/default-profile.jpeg";

const page = () => {
  const notifications = [
    {
      id: 1,
      type: "mention",
      link: "/posts/1212",
      icon_pos: 37,
      text: "is mentioned in a post",
      author: {
        id: 1,
        fullName: "Emon",
        profilePicture: {
          url: "/images/default-profile.jpeg",
          pub_id: 1,
        },
      },
      createdAt: "2023-01-01T00:00:00.000Z",
    },
    {
      id: 2,
      type: "friend_request",
      link: "/posts/1212",
      icon_pos: 43,
      text: "sent you a friend request",
      author: {
        id: 1,
        fullName: "Emon",
        profilePicture: {
          url: "/images/default-profile.jpeg",
          pub_id: 1,
        },
      },
      createdAt: "2023-01-01T00:00:00.000Z",
    },
    {
      id: 3,
      type: "react",
      reaction: "haha",
      text: "is reacted to your post",
      link: "/posts/1212",
      icon_pos: 7,
      author: {
        id: 1,
        fullName: "Emon",
        profilePicture: {
          url: "/images/default-profile.jpeg",
          pub_id: 1,
        },
      },
      createdAt: "2023-01-01T00:00:00.000Z",
    },
    {
      id: 4,
      type: "message",
      text: "is sent you a message",
      link: "/posts/1212",
      icon_pos: 10,
      author: {
        id: 1,
        fullName: "Emon",
        profilePicture: {
          url: "/images/default-profile.jpeg",
          pub_id: 1,
        },
      },
      createdAt: "2025-06-01T00:00:00.000Z",
    },
    {
      id: 5,
      type: "message",
      text: "is sent you a message",
      link: "/posts/1212",
      icon_pos: 10,
      author: {
        id: 1,
        fullName: "Emon",
        profilePicture: {
          url: "/images/default-profile.jpeg",
          pub_id: 1,
        },
      },
      createdAt: "2025-06-01T00:00:00.000Z",
    },
    {
      id: 6,
      type: "message",
      text: "is sent you a message",
      link: "/posts/1212",
      icon_pos: 10,
      author: {
        id: 1,
        fullName: "Emon",
        profilePicture: {
          url: "/images/default-profile.jpeg",
          pub_id: 1,
        },
      },
      createdAt: "2025-06-01T00:00:00.000Z",
    },
    {
      id: 7,
      type: "message",
      text: "is sent you a message",
      link: "/posts/1212",
      icon_pos: 10,
      author: {
        id: 1,
        fullName: "Emon",
        profilePicture: {
          url: "/images/default-profile.jpeg",
          pub_id: 1,
        },
      },
      createdAt: "2025-06-01T00:00:00.000Z",
    },
    {
      id: 8,
      type: "message",
      text: "is sent you a message",
      link: "/posts/1212",
      icon_pos: 10,
      author: {
        id: 1,
        fullName: "Emon",
        profilePicture: {
          url: "/images/default-profile.jpeg",
          pub_id: 1,
        },
      },
      createdAt: "2025-06-01T00:00:00.000Z",
    },
    {
      id: 9,
      type: "message",
      text: "is sent you a message",
      link: "/posts/1212",
      icon_pos: 10,
      author: {
        id: 1,
        fullName: "Emon",
        profilePicture: {
          url: "/images/default-profile.jpeg",
          pub_id: 1,
        },
      },
      createdAt: "2025-06-01T00:00:00.000Z",
    },
  ];

  function formatMaxUnit(ms: number): string {
    const minutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const years = Math.floor(days / 365); // simple approximation

    if (years >= 1) return `${years}y`;
    if (days >= 1) return `${days}d`;
    if (hours >= 1) return `${hours}h`;
    return `${minutes}min`;
  }

  return (
    <div className="h-full min-h-full w-full flex justify-center items-center md:py-6 py-0">
      <div
        className={`bg-white flex flex-col rounded-lg shadow-lg border overflow-hidden mx-auto md:max-w-lg w-full`}
      >
        <div className="p-4 border-b mx-auto w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Notifications</h3>
            <Button variant="ghost" size="sm">
              Mark all as read
            </Button>
          </div>
        </div>
        <div className="overflow-y-auto mx-auto">
          {notifications.map((n) => (
            <div
              id={"notification-" + n.id.toString()}
              key={n.id}
              className="flex justify-between hover:bg-gray-200 px-4 py-2"
            >
              <div className="flex gap-3">
                <div className="rounded-full size-14 relative">
                  <Image
                    src={defaultImage}
                    alt={n.author.fullName}
                    width={56}
                    height={56}
                    className="rounded-full"
                    // unoptimized
                  />
                  {/* <img
                    src={n.author.profilePicture.url}
                    alt={n.author.fullName}
                    width="56"
                    height="56"
                  /> */}

                  <div className="absolute -bottom-1 -right-1 size-7 rounded-full bg-slate-500">
                    <i
                      style={{
                        width: "28px",
                        height: "28px",
                        backgroundImage: `url(${
                          process.env.NEXT_PUBLIC_CLIENT_URL
                        }${
                          // n.reaction
                          //   ? "/images/like.svg"
                          // :
                          "/images/fb-icons.png"
                        })`,
                        backgroundPosition: `0px -${
                          (n.icon_pos - 1) * 28 + n.icon_pos - 1
                        }px`,
                        backgroundSize: "auto",
                        backgroundRepeat: "no-repeat",
                        display: "inline-block",
                      }}
                    ></i>
                  </div>
                </div>
                <div className="flex-1 text-sm">
                  <div className="flex items-center gap-1 h-auto justify-start">
                    <p>
                      {" "}
                      <span className="font-semibold">
                        {n.author.fullName}
                      </span>{" "}
                      {n.text} Lorem ipsum dolor sit amet sdfsadfs asdfasdfsdf{" "}
                    </p>
                  </div>
                  <p>
                    {formatMaxUnit(
                      new Date().getTime() - new Date(n.createdAt).getTime()
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-2 border-t text-center">
          <Button variant="link" className="text-[#1877F2]">
            See previous notifications
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
