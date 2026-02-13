import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import client from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { ImageIcon, Share, Users } from "lucide-react";
import React from "react";

const page = async () => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Intro</h3>
      <div className="space-y-3 text-sm">
        <p>{"user.bio"}</p>
        <div className="flex items-center">
          <ImageIcon className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>
            Works at workplace
            {/* {user.workplace} */}
          </span>
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>
            Studied at education
            {/* {user.education} */}
          </span>
        </div>
        <div className="flex items-center">
          <Share className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>
            Lives in
            {/* {user.location} */}
          </span>
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{"0"} followers</span>
        </div>
        <Button variant="outline" className="w-full">
          Edit Details
        </Button>
      </div>
    </Card>
  );
};

export default page;
