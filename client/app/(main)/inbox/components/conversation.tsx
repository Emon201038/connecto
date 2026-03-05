import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import timeAgo from "@/lib/time-ago";
import { cn } from "@/lib/utils";
import { IConversation, IMessage, IMessageType, IUser } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Like } from "../[chatId]/components/RightSideBar";

const Conversation = ({
  conversation,
  isSeenByOther,
  session,
}: {
  conversation: IConversation;
  isSeenByOther: boolean;
  session?: IUser | null;
}) => {
  const pathname = usePathname();
  return (
    <Link
      key={conversation.id}
      href={`/inbox/${conversation.id}`}
      className={cn(
        "w-full flex items-center gap-4 hover:bg-muted pl-1 pr-4 py-2 rounded-sm",
        {
          "bg-muted": pathname === `/inbox/${conversation.id}`,
        },
      )}
    >
      <div className="relative">
        <Avatar className="size-13.75">
          <AvatarImage
            src={conversation.avatar || "/images/default-profile.jpeg"}
          />
          <AvatarFallback>
            {conversation.title.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {conversation?.isOnline && (
          <div className="size-2.5 bg-green-500 absolute bottom-1 right-1 rounded-full "></div>
        )}
      </div>
      <div className="grow flex justify-between items-center">
        <div className="">
          <h2 className={`${!isSeenByOther ? "font-medium" : "font-semibold"}`}>
            {conversation.title}
          </h2>
          <LastMessage message={conversation.lastMessage} />
        </div>
        {conversation.lastMessage?.status === "unseen" &&
          conversation.lastMessage?.sender.id === session?.id && (
            <div className="size-2.5 bg-primary rounded-full" />
          )}
      </div>
    </Link>
  );
};

const LastMessage = ({
  message,
  session,
}: {
  message: IMessage;
  session?: IUser;
}) => {
  if (!message) return null;

  const isSeenByOther = false;
  return (
    <div
      className={`flex gap-2 ${
        !isSeenByOther ? "opacity-70" : "opacity-100 font-bold"
      }`}
    >
      <div className="text-xs opacity-70">
        {message?.sender?.id === session?.id && "You:"}{" "}
        {message.type === IMessageType.TEXT ? (
          message?.content
            ?.slice(0, 28)
            ?.concat(message?.content?.length > 28 ? "..." : "")
        ) : message.type === IMessageType.EMOJI ? (
          message.content === "LIKE" ? (
            <Like className="size-4" />
          ) : (
            String.fromCodePoint(parseInt(message.content, 16))
          )
        ) : (
          "Attachment"
        )}
      </div>
      <div className="text-xs opacity-70">
        . {timeAgo(new Date(message?.createdAt), "1m")}
      </div>
    </div>
  );
};

export default Conversation;
