import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

// type MessageWithConversationObject = Omit<BaseMessage, "conversation"> & {
//   conversation: {
//     id: string;
//   };
// };

// Define socket.io event types
export interface ClientToServerEvents {
  createConversation: () => void;
  join: (id: string) => void;
  joinConversation: (id: string) => void;
  // sendMessage: (message: Partial<MessageWithConversationObject>) => void;
  startTyping: (data: { conversationId: string; senderId: string }) => void;
  stopTyping: (data: { conversationId: string; senderId: string }) => void;
}

export interface ServerToClientEvents {
  conversationCreated: () => void;
  // receiveMessage: (message: Partial<MessageWithConversationObject>) => void;
  startTyping: (data: { conversationId: string; senderId: string }) => void;
  stopTyping: (data: { conversationId: string; senderId: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}

// Declare the io server instance
let io: Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

// Module pattern: export an object with initialize and getInstance
const socketInstance = {
  initialize(server: HttpServer) {
    io = new Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    // io.on(
    //   "connection",
    //   (
    //     socket: Socket<
    //       ClientToServerEvents,
    //       ServerToClientEvents,
    //       InterServerEvents,
    //       SocketData
    //     >
    //   ) => {
    //     console.log("🟢 Socket connected:", socket.handshake.query.id);

    //     socket.on("join", (conversationId: string) => {
    //       socket.join(conversationId);
    //       console.log(`Socket ${socket.id} joined room ${conversationId}`);
    //     });

    //     socket.on("joinConversation", (conversationId: string) => {
    //       socket.join(conversationId);
    //       console.log(`Socket ${socket.id} joined room ${conversationId}`);
    //     });

    //     socket.on("startTyping", (data) => {
    //       socket.to(data.conversationId).emit("startTyping", data);
    //     });

    //     socket.on("stopTyping", (data) => {
    //       socket.to(data.conversationId).emit("stopTyping", data);
    //     });

    //     // socket.on("sendMessage", (message: Partial<MessageWithConversationObject>) => {
    //     //   console.log(message);
    //     //   socket.to(message!.conversation!.id as string).emit("receiveMessage", message);
    //     // });

    //     socket.on("disconnect", () => {
    //       console.log("🔴 Socket disconnected:", socket.id);
    //     });
    //   }
    // );
  },

  // getInstance() {
  //   if (!io) {
  //     throw new Error("Socket.io not initialized. Call initialize() first.");
  //   }
  //   return io;
  // },
};

export default socketInstance;
