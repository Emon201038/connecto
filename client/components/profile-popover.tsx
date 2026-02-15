"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  MessageSquare,
  LogOut,
  ArrowLeft,
  Shield,
  Bell,
  FileText,
  Phone,
  Mail,
  Accessibility,
  Moon,
  Sun,
  Type,
  ChevronDown,
  ChevronRightIcon,
  BadgeHelpIcon,
  Laptop,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "../app/components/ui/skeleton";
import { toast } from "sonner";
import { logout } from "@/actions";
import { RadioGroup, RadioGroupItem } from "../app/components/ui/radio-group";
import { Label } from "../app/components/ui/label";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface ProfilePopoverProps {
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
}

type ViewType = "main" | "settings" | "help" | "display";

export function ProfilePopover({
  userName = "John Doe",
  userEmail = "john@example.com",
  avatarUrl,
}: ProfilePopoverProps) {
  const [currentView, setCurrentView] = useState<ViewType>("main");
  const [isAnimating, setIsAnimating] = useState(false);
  // const [logout, { isLoading }] = useLogoutMutation();

  const router = useRouter();
  const themes = [
    {
      value: "light",
      label: "Light",
      icon: Sun,
    },
    {
      value: "dark",
      label: "Dark",
      icon: Moon,
    },
    {
      value: "system",
      label: "System",
      icon: Laptop,
    },
  ];
  const { theme, setTheme } = useTheme();

  const handleMenuClick = (action: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      if (action === "Settings & Privacy") {
        setCurrentView("settings");
      } else if (action === "Help & Support") {
        setCurrentView("help");
      } else if (action === "Display & Accessibility") {
        setCurrentView("display");
      }
      setIsAnimating(false);
    }, 150);
    // Add your other action logic here
  };

  const handleBack = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentView("main");
      setIsAnimating(false);
    }, 150);
  };

  const RenderSubMenu = () => {
    switch (currentView) {
      case "settings":
        return (
          <div className="p-2">
            <div className="flex items-center gap-2 p-2 mb-2 w-full whitespace-nowrap ">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold text-[18px] w-full whitespace-nowrape">
                Settings & Privacy
              </h3>
            </div>
            <Button variant="ghost" className="w-full justify-start gap-3 h-10">
              <Shield className="h-4 w-4" />
              Privacy Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-10">
              <Bell className="h-4 w-4" />
              Notifications
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-10">
              <Settings className="h-4 w-4" />
              Account Settings
            </Button>
          </div>
        );

      case "help":
        return (
          <div className="p-2">
            <div className="flex items-center gap-2 p-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold text-[18px] w-full whitespace-nowrape">
                Help & Support
              </h3>
            </div>
            <Button variant="ghost" className="w-full justify-start gap-3 h-10">
              <FileText className="h-4 w-4" />
              Help Center
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-10">
              <Phone className="h-4 w-4" />
              Contact Support
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-10">
              <Mail className="h-4 w-4" />
              Report a Problem
            </Button>
          </div>
        );

      case "display":
        return (
          <div className="p-2">
            <div className="flex items-center gap-2 p-2 mb-2 w-full flex-nowrap content-normal">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold text-[18px] whitespace-nowrape w-full min-w-full">
                Display & Accessibility
              </h3>
            </div>
            <RadioGroup name="theme" value={theme} onValueChange={setTheme}>
              {themes.map(({ value, label, icon: Icon }) => (
                <Label
                  key={value}
                  className={cn(
                    "relative cursor-pointer rounded-md p-4 h-10",
                    "flex items-center justify-start gap-2",
                    "transition-all",
                    "hover:bg-muted",
                    "data-[state=checked]:border-primary data-[state=checked]:bg-primary/10",
                  )}
                >
                  {/* Hidden Radio */}
                  <RadioGroupItem value={value} className="peer sr-only" />

                  {/* Content */}
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{label}</span>

                  {/* Highlight when checked */}
                  <span
                    className="
              absolute inset-0 rounded-md
              border-2 border-transparent
              peer-data-[state=checked]:border-primary
            "
                  />
                </Label>
              ))}
            </RadioGroup>

            <Button variant="ghost" className="w-full justify-start gap-3 h-10">
              <Type className="h-4 w-4" />
              Font Size
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-10">
              <Accessibility className="h-4 w-4" />
              Accessibility Options
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const session = useSession();

  const handleLogout = async () => {
    try {
      // 1. Call your backend logout via RTK Query
      // await logout({}).unwrap();

      // 2. Clear NextAuth session
      await logout();
      // console.log(res);
      // if (res) {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/login");
      // }
    } catch (err) {
      console.log(err);
      toast.error("Logout failed:");
    }
  };

  if (session.status === "loading")
    return <Skeleton className="size-10 rounded-full" />;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <Avatar className="size-6">
            <AvatarImage
              src={
                session?.data?.user?.profilePicture?.url ||
                "/images/default-profile.jpeg"
              }
              alt="User"
            />
            <AvatarFallback>
              {session?.data?.user?.fullName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 -right-px size-3 bg-[#e2e5eb] dark:bg-muted rounded-full">
            <ChevronDown size={15} />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="!w-full p-0 overflow-hidden" align="end">
        <div className="relative">
          {/* Main Menu */}
          <div
            className={`transition-transform duration-300 ease-in-out ${
              currentView === "main"
                ? "transform translate-x-0"
                : "transform -translate-x-full"
            }`}
          >
            <div className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={avatarUrl || "/images/default-profile.jpeg"}
                    alt={userName}
                  />
                  <AvatarFallback>
                    {session?.data?.user?.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-medium text-sm">
                    {session?.data?.user?.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session?.data?.user?.email}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="py-2 px-1 flex flex-col w-full">
              {[
                {
                  menue: "Settings & Privacy",
                  icon: <Settings size={20} />,
                },
                {
                  menue: "Help & Support",
                  icon: <BadgeHelpIcon size={20} />,
                },
                {
                  menue: "Display & Accessibility",
                  icon: <Moon size={20} />,
                },
              ].map((item) => (
                <div
                  key={item.menue}
                  className="w-full gap-3 h-[54px] cursor-pointer flex justify-between items-center hover:bg-shade rounded-sm px-1 font-semibold text-[15px]"
                  onClick={() => handleMenuClick(item.menue)}
                >
                  <div className="flex justify-start items-center gap-1">
                    <div className="size-9 bg-normal rounded-full flex justify-center items-center">
                      {item.icon}
                    </div>
                    <p>{item.menue}</p>
                  </div>
                  <Button variant={"ghost"} size={"icon"}>
                    <ChevronRightIcon />
                  </Button>
                </div>
              ))}

              <div
                className="w-full gap-3 h-[54px] cursor-pointer flex justify-between items-center  rounded-sm px-1 font-semibold text-[15px]"
                onClick={() => handleMenuClick("Give Feedback")}
              >
                <div className="flex justify-start items-center gap-1">
                  <div className="size-9 bg-normal rounded-full flex justify-center items-center">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <p>Give Feedback</p>
                </div>
              </div>

              <Separator className="my-2" />

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-10 text-destructive hover:text-destructive cursor-pointer"
                onClick={() => handleLogout()}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* Sub Menu */}
          <div
            className={`absolute top-0 left-0 w-full transition-transform duration-300 ease-in-out ${
              currentView !== "main"
                ? "transform translate-x-0"
                : "transform translate-x-full"
            }`}
          >
            <RenderSubMenu />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
