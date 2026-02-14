"use client";

import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";

interface User {
  id: string;
  name: string;
  image?: string;
  color?: string;
}

interface AvatarStackProps {
  users: User[];
  limit?: number;
  size?: "sm" | "md" | "lg";
  overlap?: number;
}

export default function AvatarStack({
  users,
  limit = 8,
  size = "md",
  overlap = 8,
}: AvatarStackProps) {
  const displayUsers = users.slice(0, limit);
  const remainingCount = users.length - limit;

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const avatarSize = sizeClasses[size];

  return (
    <div className="flex items-center">
      <div
        className="flex -space-x-(--overlap)"
        style={{ "--overlap": `${overlap}px` } as React.CSSProperties}
      >
        {displayUsers.map((user) => (
          <Avatar
            key={user.id}
            className={`${avatarSize} rounded-full border-2 border-background`}
          >
            <AvatarImage
              src={user.image || "/placeholder.svg"}
              alt={user.name}
            />
            <AvatarFallback
              className="text-white"
              style={{ backgroundColor: user.color || getRandomColor(user.id) }}
            >
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        ))}

        {remainingCount > 0 && (
          <Avatar
            className={`${avatarSize} rounded-full border-2 border-background bg-muted`}
          >
            <AvatarFallback>
              <MoreHorizontal />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

// Helper function to generate a consistent color based on user id
function getRandomColor(id: string): string {
  const colors = [
    "#f97316", // orange
    "#84cc16", // lime
    "#06b6d4", // cyan
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#14b8a6", // teal
    "#f43f5e", // rose
    "#6366f1", // indigo
  ];

  // Use the string's char codes to pick a consistent color
  const charCodeSum = id
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
}
