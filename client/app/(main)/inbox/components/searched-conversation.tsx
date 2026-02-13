import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateDirectConversationMutation } from "@/redux/features/conversation/conversationApi";
import { IUser } from "@/types";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface Props {
  users: IUser[];
  setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
  isLoading: boolean;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setSearched: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchedConversation = ({
  users,
  setUsers,
  isLoading,
  inputValue,
  setInputValue,
  setSearched,
}: Props) => {
  const router = useRouter();
  const [createConversation] = useCreateDirectConversationMutation();

  const handleClick = async (user: IUser) => {
    if (user.conversation?.hasConversation) {
      setInputValue("");
      setSearched(false);
      router.push(`/inbox/${user.conversation?.id}`);
    } else {
      const toastId = toast.loading("Creating conversation...");
      try {
        const res = await createConversation({
          participantId: user.id,
          inputValue,
        }).unwrap();
        if (res.conversation?.id) {
          toast.success("Conversation created", { id: toastId });
          setUsers((prev) =>
            prev.map((u) => {
              if (u.id === user.id) {
                return {
                  ...u,
                  conversation: {
                    ...u.conversation,
                    hasConversation: true,
                    id: res.conversation?.id,
                  },
                };
              } else {
                return u;
              }
            })
          );
          setInputValue("");
          setSearched(false);
          router.push(`/inbox/${res.conversation?.id}`);
        } else {
          toast.error("Failed to create conversation", { id: toastId });
        }
      } catch (error) {
        toast.error("Failed to create conversation", { id: toastId });
      }
    }
  };
  return (
    <div className="">
      <h1>Search users</h1>
      {isLoading ? (
        <div>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex gap-3 items-center p-4 h-[68px]">
              <Skeleton className="size-9 rounded-full animate-pulse" />
              <Skeleton className="h-5 w-36 animate-pulse rounded-none" />
            </div>
          ))}
        </div>
      ) : users?.length > 0 ? (
        users.map((user) => (
          <div
            key={user.id}
            className="flex gap-3 items-center hover:bg-slate-50 p-4 cursor-pointer"
            onClick={() => handleClick(user)}
          >
            <Avatar className="size-9">
              <AvatarImage
                src={user.profilePicture?.url || "/images/default-profile.jpeg"}
              />
              <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-normal text-lg">{user.fullName}</h1>

              {user.conversation?.hasConversation ? (
                ""
              ) : (
                <p className="text-xs opacity-70">
                  Click to start a conversation
                </p>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 mt-8 text-center">No User found</div>
      )}
    </div>
  );
};

export default SearchedConversation;
