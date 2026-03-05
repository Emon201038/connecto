import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { IPost } from "@/interface/post.interface";

interface Props {
  post: IPost;
}

const PostDropdown = ({ post }: Props) => {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => {}}>Report post</DropdownMenuItem>
        <DropdownMenuItem>Save post</DropdownMenuItem>
        <DropdownMenuItem>Hide post</DropdownMenuItem>
        <DropdownMenuItem>Unfollow {post.author.fullName}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostDropdown;
