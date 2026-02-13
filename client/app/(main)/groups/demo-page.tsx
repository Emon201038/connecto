"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function GroupsPage() {
  const groups = [
    {
      id: "web-developers",
      name: "Web Developers",
      description:
        "A community for web developers to share knowledge and collaborate",
      members: "1.2k",
      privacy: "Private",
      image: "/group-logo.jpg",
      activity: "Very active",
    },
    {
      id: "react-enthusiasts",
      name: "React Enthusiasts",
      description: "Everything about React, from basics to advanced patterns",
      members: "856",
      privacy: "Public",
      image: "/tech-workspace.jpg",
      activity: "Active",
    },
    {
      id: "ui-ux-designers",
      name: "UI/UX Designers",
      description: "Design inspiration, critiques, and career advice",
      members: "2.1k",
      privacy: "Public",
      image: "/abstract-geometric-shapes.png",
      activity: "Moderate",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Groups</h1>
            <p className="text-muted-foreground">
              Connect with communities that share your interests
            </p>
          </div>
          <Link href="/groups/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search groups..." className="pl-9" />
          </div>
          <Button variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending
          </Button>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Link key={group.id} href={`/groups/${group.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative rounded-t-lg">
                    <img
                      src={group.image || "/placeholder.svg"}
                      alt={group.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-12 h-12 border-2 border-background -mt-8">
                        <AvatarImage src={group.image || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {group.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 mt-2">
                        <h3 className="font-semibold text-foreground">
                          {group.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary" className="text-xs">
                            {group.privacy}
                          </Badge>
                          <span>•</span>
                          <Users className="w-3 h-3" />
                          <span>{group.members}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {group.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {group.activity}
                      </span>
                      <Button size="sm" variant="outline">
                        View Group
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
