// src/types/controller.ts
import { Request, Response } from 'express';
import { HttpMethod } from '../types/httpMethods';
import { Server as SocketIOServer} from "socket.io";
export interface Controller {
  method: HttpMethod;
  url: string;
  validator?: any;
  controller: (req: Request, res: Response,io:SocketIOServer) => Promise<Response<any, Record<string, any>> | void>;
}