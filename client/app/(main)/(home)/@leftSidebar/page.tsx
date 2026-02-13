import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bookmark,
  Calendar,
  Clock,
  Flag,
  LayoutGrid,
  MessagesSquare,
  ShoppingBag,
  Users,
  Video,
} from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function LeftSidebar() {
  const session = await auth();
  if (!session) {
    redirect("/login?callback=/");
  }
  // Mock data for sidebar items
  const mainLinks = [
    {
      icon: <Users className="h-5 w-5 mr-3" />,
      label: "Friends",
      href: "/friends",
    },
    {
      icon: <MessagesSquare className="h-5 w-5 mr-3" />,
      label: "Messenger",
      href: "/inbox",
    },
    {
      icon: <LayoutGrid className="h-5 w-5 mr-3" />,
      label: "Groups",
      href: "/groups",
    },
    { icon: <Flag className="h-5 w-5 mr-3" />, label: "Pages", href: "#" },
    {
      icon: <ShoppingBag className="h-5 w-5 mr-3" />,
      label: "Marketplace",
      href: "/marketplace",
    },
    { icon: <Video className="h-5 w-5 mr-3" />, label: "Watch", href: "#" },
    {
      icon: <Calendar className="h-5 w-5 mr-3" />,
      label: "Events",
      href: "/events",
    },
    { icon: <Clock className="h-5 w-5 mr-3" />, label: "Memories", href: "#" },
    { icon: <Bookmark className="h-5 w-5 mr-3" />, label: "Saved", href: "#" },
  ];

  // Mock shortcuts
  const shortcuts = [
    {
      label: "Web Development",
      avatar: "/placeholder.svg?height=32&width=32&text=WD",
    },
    {
      label: "React Developers",
      avatar: "/placeholder.svg?height=32&width=32&text=RD",
    },
    {
      label: "UI/UX Design Community",
      avatar: "/placeholder.svg?height=32&width=32&text=UD",
    },
    {
      label: "JavaScript Enthusiasts",
      avatar: "/placeholder.svg?height=32&width=32&text=JS",
    },
    {
      label: "Photography Club",
      avatar: "/placeholder.svg?height=32&width=32&text=PC",
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-1">
        <Link
          href={`/${session?.user?.username}`}
          className="flex items-center p-2 rounded-md hover:bg-muted"
        >
          <Avatar className="h-8 w-8 mr-3">
            <AvatarImage
              src={
                session?.user?.profilePicture?.url ||
                "/images/default-profile.jpeg"
              }
              alt="user"
            />
            <AvatarFallback>
              {session?.user?.fullName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">
            {session?.user?.fullName?.split(" ")[0]}
          </span>
        </Link>
        {session?.user?.role === "ADMIN" && (
          <Link
            href={"/dashboard/admin"}
            className="flex items-center p-2 rounded-md hover:bg-muted"
          >
            Admin Dashboard
          </Link>
        )}

        {mainLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="flex items-center p-2 rounded-md hover:bg-muted"
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium text-sm text-muted-foreground mb-2 px-2">
          Your shortcuts
        </h3>
        <div className="space-y-1">
          {shortcuts.map((shortcut, index) => (
            <Link
              key={index}
              href="#"
              className="flex items-center p-2 rounded-md hover:bg-muted"
            >
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage
                  src={shortcut.avatar || "/placeholder.svg"}
                  alt={shortcut.label}
                />
                <AvatarFallback>
                  {shortcut.label.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{shortcut.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="text-xs text-muted-foreground pt-2 px-2">
        <div className="space-x-2">
          <Link href="#" className="hover:underline">
            Privacy
          </Link>
          <span>·</span>
          <Link href="#" className="hover:underline">
            Terms
          </Link>
          <span>·</span>
          <Link href="#" className="hover:underline">
            Advertising
          </Link>
          <span>·</span>
          <Link href="#" className="hover:underline">
            Cookies
          </Link>
        </div>
        <div className="mt-2">Meta © {new Date().getFullYear()}</div>
      </div>
    </div>
  );
}
