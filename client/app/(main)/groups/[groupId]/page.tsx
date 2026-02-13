"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Calendar,
  FileText,
  Settings,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share,
  Plus,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useSingleGroupPostsQuery } from "@/redux/features/group/groupApi";
import PostCard from "@/components/post-card";
import { LoadingFeed } from "@/components/loading-feed";

export default function GroupDetailsPage() {
  const params = useParams<{ groupId: string }>();

  const { data, isLoading } = useSingleGroupPostsQuery({
    groupId: params.groupId,
    page: 1,
    limit: 15,
  });

  return (
    <div className="space-y-4">
      {isLoading && (
        // <div className="w-full max-w-xl mx-auto space-y-6 py-6 mt-12 md:mt-0 h-full overflow-auto">
        <LoadingFeed />
        // </div>
      )}
      {!data?.data.posts.length && (
        <h1 className="py-12 text-center text-lg">No posts available yet</h1>
      )}
      {data?.data.posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
