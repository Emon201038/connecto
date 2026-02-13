import { Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { IUserRole } from "../modules/user/user.interface";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../../socket";

export interface IResolverContext {
  req: Request;
  res: Response;
  // io?: Server<
  //   ClientToServerEvents,
  //   ServerToClientEvents,
  //   InterServerEvents,
  //   SocketData
  // >;
  user: {
    id: string;
    email: string;
    role: IUserRole;
    session_id: string;
  } | null;
}
