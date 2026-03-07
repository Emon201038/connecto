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
import { useMeQuery } from "@/redux/features/auth/authApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useSoftDeletePostMutation } from "@/redux/features/post/postApi";

interface Props {
  post: IPost;
}

const PostDropdown = ({ post }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const { data: session, isLoading } = useMeQuery(void 0, {
    skip: !post.author.id,
  });
  const [deletePost, { isLoading: isDeletingPost }] =
    useSoftDeletePostMutation();

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    );
  }

  if (!session) {
    return (
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    );
  }

  const isAuthor = session.id === post.author.id;
  const authorOptions = [
    {
      label: "Edit post",
      action: () => {},
    },
    {
      label: "Delete post",
      action: () => setIsDeleting(true),
    },
  ];

  if (isAuthor) {
    return (
      <div>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {authorOptions.map((option) => (
              <DropdownMenuItem key={option.label} onClick={option.action}>
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
          <AlertDialogContent>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undo.
            </AlertDialogDescription>

            <div className="flex justify-center items-center gap-1 *:flex-1">
              <AlertDialogAction
                onClick={async () => await deletePost(post.id)}
              >
                Yes
              </AlertDialogAction>
              <AlertDialogCancel>No</AlertDialogCancel>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

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
