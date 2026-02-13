import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

const GroupMembers = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Members</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search members..." className="pl-9 w-64" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 text-center">
              <Avatar className="w-16 h-16 mx-auto mb-3">
                <AvatarImage
                  src={`/community-member.png?height=64&width=64&query=member${
                    i + 1
                  }`}
                />
                <AvatarFallback>M{i + 1}</AvatarFallback>
              </Avatar>
              <h4 className="font-medium mb-1">Member {i + 1}</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Joined 2 months ago
              </p>
              <Button
                size="sm"
                variant="outline"
                className="w-full bg-transparent"
              >
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GroupMembers;
