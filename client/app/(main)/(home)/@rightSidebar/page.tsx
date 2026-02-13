import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gift, Plus, Search, Video } from "lucide-react";

export default function RightSidebar() {
  // Mock data for friend requests
  const friendBirthdays = [
    {
      name: "Jessica Taylor",
      avatar: "/placeholder.svg?height=32&width=32&text=JT",
    },
  ];

  // Mock data for contacts
  const contacts = [
    {
      name: "Emma Wilson",
      status: "active",
      avatar: "/placeholder.svg?height=32&width=32&text=EW",
    },
    {
      name: "Michael Brown",
      status: "active",
      avatar: "/placeholder.svg?height=32&width=32&text=MB",
    },
    {
      name: "Sarah Johnson",
      status: "inactive",
      avatar: "/placeholder.svg?height=32&width=32&text=SJ",
    },
    {
      name: "David Garcia",
      status: "active",
      avatar: "/placeholder.svg?height=32&width=32&text=DG",
    },
    {
      name: "Linda Martinez",
      status: "inactive",
      avatar: "/placeholder.svg?height=32&width=32&text=LM",
    },
    {
      name: "Robert Taylor",
      status: "active",
      avatar: "/placeholder.svg?height=32&width=32&text=RT",
    },
    {
      name: "Jennifer Anderson",
      status: "inactive",
      avatar: "/placeholder.svg?height=32&width=32&text=JA",
    },
    {
      name: "William Thomas",
      status: "active",
      avatar: "/placeholder.svg?height=32&width=32&text=WT",
    },
  ];

  // Mock data for group conversations
  const groups = [
    {
      name: "UX/UI Designers",
      avatar: "/placeholder.svg?height=32&width=32&text=UD",
    },
    {
      name: "Frontend Developers",
      avatar: "/placeholder.svg?height=32&width=32&text=FD",
    },
    {
      name: "Travel Enthusiasts",
      avatar: "/placeholder.svg?height=32&width=32&text=TE",
    },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Birthdays Section */}
      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground px-2">
          Birthdays
        </h3>
        {friendBirthdays.length > 0 ? (
          <Link
            href="#"
            className="flex items-center p-2 rounded-md hover:bg-muted"
          >
            <div className="w-8 h-8 flex items-center justify-center mr-3">
              <Gift className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-sm">
              Today is{" "}
              <span className="font-medium">
                {friendBirthdays[0].name}&apos;s
              </span>{" "}
              birthday.
            </span>
          </Link>
        ) : (
          <p className="text-sm text-muted-foreground px-2">
            No birthdays today.
          </p>
        )}
      </div>

      {/* Contacts Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-medium text-sm text-muted-foreground">
            Contacts
          </h3>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-1">
          {contacts.map((contact, index) => (
            <Link
              key={index}
              href="#"
              className="flex items-center p-2 rounded-md hover:bg-muted"
            >
              <div className="relative">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage
                    src={contact.avatar || "/placeholder.svg"}
                    alt={contact.name}
                  />
                  <AvatarFallback>
                    {contact.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {contact.status === "active" && (
                  <span className="absolute bottom-0 right-2 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                )}
              </div>
              <span className="text-sm">{contact.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Group Conversations */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-medium text-sm text-muted-foreground">
            Group conversations
          </h3>
        </div>
        <div className="space-y-1">
          {groups.map((group, index) => (
            <Link
              key={index}
              href="#"
              className="flex items-center p-2 rounded-md hover:bg-muted"
            >
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage
                  src={group.avatar || "/placeholder.svg"}
                  alt={group.name}
                />
                <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{group.name}</span>
            </Link>
          ))}
          <Button
            variant="ghost"
            className="w-full justify-start text-sm h-10 px-2"
          >
            <Plus className="h-4 w-4 mr-3" />
            <span>Create new group</span>
          </Button>
        </div>
      </div>

      {/* Sponsored */}
      {/* <Card className="overflow-hidden">
        <div className="p-2">
          <p className="text-xs font-medium text-muted-foreground mb-2">Sponsored</p>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="aspect-[16/9] rounded-md overflow-hidden">
                <Image
                  src="/placeholder.svg?height=180&width=320&text=Ad"
                  alt="Advertisement"
                  width={320}
                  height={180}
                  className="w-full object-cover"
                />
              </div>
              <div className="text-sm">
                <Link href="#" className="font-medium hover:underline">
                  Brand Name
                </Link>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  Check out our latest products with special discounts for new customers!
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card> */}
    </div>
  );
}
