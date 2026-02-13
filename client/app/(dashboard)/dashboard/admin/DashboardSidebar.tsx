"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  FileText,
  UsersRound,
  Bell,
  Settings,
  Home,
  Menu,
  BarChart3,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ProfilePopover } from "@/components/profile-popover";

interface DashboardSidebarProps {
  userRole: string;
}

const navigation = [
  {
    name: "Overview",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
    roles: ["ADMIN", "SUPER_ADMIN", "MODERATOR"],
  },
  {
    name: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    name: "Posts",
    href: "/dashboard/admin/posts",
    icon: FileText,
    roles: ["ADMIN", "SUPER_ADMIN", "MODERATOR"],
  },
  {
    name: "Groups",
    href: "/dashboard/admin/groups",
    icon: UsersRound,
    roles: ["ADMIN", "SUPER_ADMIN", "MODERATOR"],
  },
  {
    name: "Notifications",
    href: "/dashboard/admin/notifications",
    icon: Bell,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    name: "Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
    roles: ["ADMIN", "SUPER_ADMIN", "MODERATOR"],
  },
];

function SidebarContent({
  userRole,
  onLinkClick,
}: {
  userRole: string;
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();
  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <Link
          href="/"
          className="flex items-center space-x-2"
          onClick={onLinkClick}
        >
          <Home className="h-5 w-5 text-[#1877f2]" />
          <span className="text-sm ">Back to Connecto</span>
        </Link>
      </div>

      <div className="flex-1 px-3 py-4">
        <div className="mb-4 px-3">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <p className="text-sm  mt-1">Admin Control Panel</p>
        </div>

        <nav className="space-y-2">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onLinkClick}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ",
                  isActive
                    ? "bg-[#1877f2] text-primary-text"
                    : " hover:bg-accent",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="px-3 py-2  rounded-lg">
          <p className="text-xs font-medium text-blue-900">Role</p>
          <p className="text-sm text-blue-700 capitalize">{userRole}</p>
        </div>
      </div>
    </div>
  );
}

export function MobileSidebarTrigger({ userRole }: DashboardSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 fixed lg:w-[calc(100%-319px)] w-full lg:ml-[319px] ml-0 top-0">
      <div className="flex items-center gap-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden ">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 lg:hidden ">
            <SidebarContent
              userRole={userRole}
              onLinkClick={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <BarChart3 className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ProfilePopover />
      </div>
    </div>
  );
}

export default function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  return (
    <div className="hidden lg:flex lg:flex-col lg:w-80 border-r border-gray-200 min-h-screen">
      <SidebarContent userRole={userRole} />
    </div>
  );
}
