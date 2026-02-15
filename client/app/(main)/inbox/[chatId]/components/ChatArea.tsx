"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ImageIcon,
  Mic,
  Pause,
  Plus,
  Send,
  Square,
  ThumbsUp,
  X,
} from "lucide-react";
import React, { ChangeEvent } from "react";
import { type SyntheticEvent, useEffect, useRef, useState } from "react";
import { type Message } from "@/lib/type";
import { useParams } from "next/navigation";
import { ChattingIndicator } from "./chatIndicator";
import { useSocket } from "@/providers/socket-provider";
import { useAppSelector } from "@/redux/hooks";
import { cn } from "@/lib/utils";
import Header from "./Header";
import { IConversationMember, IMessageType } from "@/types";
import Messages from "./messages";
import { useSession } from "next-auth/react";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
} from "@/redux/features/message/messageApi";
import { messengerThemes } from "@/constants/themes";
import { Like } from "./RightSideBar";
import { toast } from "sonner";
import { useGetConversationInfoQuery } from "@/redux/features/conversation/conversationApi";
import HeaderLoading from "./HeaderLoading";
import { EmojiDisplay } from "@/components/Emoji";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  conversation: IConversationMember;
}

const ChatArea = () => {
  const [inputValue, setInputValue] = useState("");
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  const session = useSession();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingRef = useRef(0);
  const isCancelledRef = useRef(false);
  const params = useParams<{ chatId: string }>();
  const socket = useSocket();

  const { openRightSidebar } = useAppSelector((state) => state.conversation);
  const { data: conversation, isLoading: conversationLoading } =
    useGetConversationInfoQuery({ id: params.chatId });

  // useEffect(() => {
  //   if (!socket) return;
  //   socket.emit("joinConversation", params.chatId);
  //   socket.on("receiveMessage", (data) => {
  //     if (data.sender != user?.id) {
  //       scrollAreaRef.current?.scrollIntoView({
  //         behavior: "smooth",
  //         block: "end",
  //       });
  //       setMsgs((prev) => [...prev, data as Message]);
  //     }
  //   });

  //   socket.on("startTyping", (data) => {
  //     if (data.senderId === user?.id) return;

  //     setTypingUsers((prev) => new Set(prev).add(data.senderId));
  //   });

  //   socket.on("stopTyping", (data) => {
  //     if (data.senderId === user?.id) return;

  //     setTypingUsers((prev) => {
  //       const updated = new Set(prev);
  //       updated.delete(data.senderId);
  //       return updated;
  //     });
  //   });

  //   return () => {
  //     socket.off("receiveMessage");
  //     socket.off("startTyping");
  //     socket.off("stopTyping");
  //   };
  // }, [params.chatId, socket, user?.id]);

  //infinite scroll effect
  // useEffect(() => {
  //   const loadMore = async () => {
  //     try {
  //       const scrollParent = scrollAreaRef.current?.parentElement;
  //       const prevScrollHeight = scrollParent?.scrollHeight ?? 0;

  //       const res = await getMessages(conversationId, meta.page + 1, meta.limit, "");
  //       if (res?.messagesByConversation?.messages?.length) {
  //         isPaginatingRef.current = true;

  //         setMsgs((prev) => [...res.messagesByConversation!.messages, ...prev]);
  //         setMeta((prev) => ({ ...prev, page: prev.page + 1 }));

  //         // Wait for DOM to update, then restore scroll position
  //         requestAnimationFrame(() => {
  //           if (scrollParent) {
  //             const newScrollHeight = scrollParent.scrollHeight;
  //             scrollParent.scrollTop += newScrollHeight - prevScrollHeight;
  //           }
  //         });
  //       }
  //     } catch (error) {
  //       toast.error(error instanceof Error ? error.message : "Something went wrong");
  //     }
  //   };

  //   const onIntersection = (items: IntersectionObserverEntry[]) => {
  //     const loaderItem = items[0];
  //     if (loaderItem.isIntersecting && meta.totalPages > meta.page) {
  //       loadMore();
  //     }
  //   };

  //   const observer = new IntersectionObserver(onIntersection);
  //   if (observer && loaderRef.current) {
  //     observer.observe(loaderRef.current);
  //   }
  //   return () => observer.disconnect();
  // }, [meta.totalPages, meta.page, conversationId, meta.limit]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // If user cancelled, do not send
        if (isCancelledRef.current || recordingRef.current < 0.5) {
          console.log("Recording cancelled or too short, not sending.");
          isCancelledRef.current = false; // reset for next recording
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mpeg",
        });
        const audioUrl = URL.createObjectURL(audioBlob);

        const newMessage: Message = {
          id: Date.now().toString(),
          content: audioUrl,
          createdAt: new Date().toString(),
          duration: recordingRef.current,
          conversation: { id: params.chatId },
          sender: {
            id: "",
            firstName: "",
            fullName: "",
          },
          type: "audio",
        };

        setMsgs((prev) => [...prev, newMessage]);
        socket?.emit("sendMessage", newMessage);
        recordingRef.current = 0;
        setRecordingTime(0);
        setIsPaused(false);

        // Clean up stream
        stream.getTracks().forEach((track) => track.stop());
        isCancelledRef.current = false;
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const nextTime = parseFloat((prev + 0.1).toFixed(1));
          recordingRef.current = nextTime;

          if (nextTime >= 30) {
            stopRecording(); // stop automatically
          }

          return nextTime;
        });
      }, 100);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);
  };

  const cancelRecording = () => {
    isCancelledRef.current = true;

    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current = null;
    }

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Clear refs and state
    audioChunksRef.current = [];
    recordingRef.current = 0;
    setRecordingTime(0);
    setIsRecording(false);
  };

  const pauseRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);

      // Pause timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const resumeRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);

      // Resume timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 0.1);
        recordingRef.current += 0.1;
      }, 100);
    }
  };

  function formatTimeProgress(seconds: number): string {
    const sec = Math.floor(seconds); // Round up to show whole remaining seconds
    const min = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    return `${min}:${remainingSec.toString().padStart(2, "0")}`;
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Always emit typing event on input
    socket?.emit("startTyping", {
      senderId: "",
      conversationId: params.chatId,
    });

    // Clear previous timer
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Emit stopTyping after 3s of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit("stopTyping", {
        senderId: "",
        conversationId: params.chatId,
      });
    }, 3000);
  };

  const handlePlayToggle = (messageId: string, isPlaying: boolean) => {
    if (isPlaying) {
      setCurrentlyPlaying(messageId);
    } else {
      setCurrentlyPlaying(null);
    }
  };

  const [sendMessageMutation, { isLoading }] = useSendMessageMutation();

  const sendMessage = async (e: SyntheticEvent) => {
    try {
      e.preventDefault();
      if (!inputValue) return;
      const newMessage = {
        id: Date.now().toString(),
        content: inputValue,
        createdAt: new Date().toString(),
        conversationId: params.chatId,
        sender: session?.data?.user.id as string,
        type: IMessageType.TEXT,
      };

      scrollAreaRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
      setInputValue("");
      const res = await sendMessageMutation(newMessage).unwrap();
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleSendEmoji = async (emoji: string) => {
    try {
      const newMessage = {
        id: Date.now().toString(),
        content: conversation?.emoji as string,
        createdAt: new Date().toString(),
        conversationId: params.chatId,
        sender: session?.data?.user.id as string,
        type: IMessageType.EMOJI,
      };

      scrollAreaRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
      await sendMessageMutation(newMessage).unwrap();
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div
      // style={{
      //   backgroundColor: theme?.colors.bg,
      //   color: theme?.colors?.messageText,
      // }}
      className={cn(
        "flex-1 flex flex-col h-full justify-center bg-background rounded-sm",
        {
          hidden: openRightSidebar,
          "md:block": true,
        },
      )}
    >
      {/* Header */}
      {conversationLoading ? (
        <HeaderLoading />
      ) : (
        <Header conversation={conversation as IConversationMember} />
      )}

      {/* Messages */}
      <div
        ref={containerRef}
        className={cn(
          `flex-1 w-full h-[calc(100%_-_112px)] overflow-y-auto space-y-3`,
        )}
      >
        <Messages conversation={conversation as IConversationMember} />
      </div>

      {/* Bottom */}
      <form
        onSubmit={sendMessage}
        className={cn(
          "relative py-3 border-t  flex items-center  rounded-b-sm gap-2",
        )}
      >
        {typingUsers.size > 0 && (
          <div className="absolute -top-5">
            <ChattingIndicator />
          </div>
        )}
        {isRecording ? (
          <>
            <div className="flex-1 px-4 flex items-center relative">
              <div className="animate-pulse mr-2  ">
                <Button
                  type="button"
                  variant={"ghost"}
                  size={"icon"}
                  onClick={cancelRecording}
                  className="size-5 bg-red-500 hover:bg-red-500 rounded-full p-1 text-white hover:text-white"
                >
                  <X size={10} />
                </Button>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-12 z-10 size-6 rounded-full bg-gray-200 flex justify-center items-center cursor-pointer">
                {/* Badge --secondary */}
                <div>{formatTimeProgress(recordingTime)}</div>
              </div>
              <div
                onClick={isPaused ? resumeRecording : pauseRecording}
                className="absolute top-1/2 -translate-y-1/2 left-16 z-10 size-6 rounded-full bg-gray-200 flex justify-center items-center cursor-pointer"
              >
                {isPaused ? (
                  <Pause size={15} />
                ) : (
                  <Square fill="blue" size={15} />
                )}
              </div>
              <div className="flex-1 mx-2">
                {/* progress */}
                <div
                  dir="left"
                  className="w-full h-10"
                  // value={(recordingTime / 30) * 100}
                />
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-transparent"
              onClick={stopRecording}
            >
              <Send className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hover:bg-transparent"
              onClick={startRecording}
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              className="hover:bg-transparent"
              variant="ghost"
              size="icon"
            >
              <Plus className="w-5 h-5" />
            </Button>
            <Button
              type="button"
              className="hover:bg-transparent tooltip"
              variant="ghost"
              size="icon"
              data-title="Attatch Up to 5 MB"
            >
              <ImageIcon className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <Input
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Aa"
                className="flex-1"
                // disabled={!!audioUrl}
              />
            </div>
            {inputValue ? (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-transparent"
              >
                <Send className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full p-1"
                onClick={() => handleSendEmoji((<Like />) as unknown as string)}
              >
                {!conversation?.emoji ? (
                  <Skeleton className="size-6" />
                ) : conversation?.emoji === "LIKE" ? (
                  <Like className="size-6" />
                ) : (
                  <EmojiDisplay emoji={conversation?.emoji as string} />
                )}
              </Button>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default ChatArea;
