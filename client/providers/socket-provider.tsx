"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "./session";
import { Message } from "@/lib/type";

// Define the type of events your socket may emit or receive
type ServerToClientEvents = {
  // example: message: (msg: string) => void;
  conversationCreated: (conversationId: string) => void;
  receiveMessage: (message: Partial<Message>) => void;
  startTyping: (data: { conversationId: string; senderId: string }) => void;
  stopTyping: (data: { conversationId: string; senderId: string }) => void;
};

type ClientToServerEvents = {
  // example: sendMessage: (msg: string) => void;
  createConversation: () => void;
  join: (id: string) => void;
  joinConversation: (conversationId: string) => void;
  sendMessage: (message: Partial<Message>) => void;
  startTyping: (data: { conversationId: string; senderId: string }) => void;
  stopTyping: (data: { conversationId: string; senderId: string }) => void;
};

// Create a typed socket context
const SocketContext = createContext<Socket<
  ServerToClientEvents,
  ClientToServerEvents
> | null>(null);

// Custom hook to use the socket
export const useSocket = () => {
  return useContext(SocketContext);
};

// Define props type for the provider
interface SocketProviderProps {
  children: ReactNode;
}

export default function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  const serverUrl = process.env.NEXT_PUBLIC_API_URL;
  const session = useSession();

  useEffect(() => {
    if (!serverUrl) return;

    let socketServer: Socket<ServerToClientEvents, ClientToServerEvents>;
    if (session?.id) {
      const socketIo: Socket<ServerToClientEvents, ClientToServerEvents> = io(
        serverUrl,
        {
          query: { id: session?.id },
        }
      );
      socketServer = socketIo;
      setSocket(socketIo);
      socketIo.emit("join", session.id);
    }

    return () => {
      socketServer?.disconnect();
    };
  }, [serverUrl, session?.id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
