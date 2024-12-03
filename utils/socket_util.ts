import { Server, Socket } from "socket.io";
import { getTokenValue } from "../utils/jwt";
import mongoose from "mongoose";
import { NextFunction } from "express";
/**
 * Return the socket by id.
 *
 * @param {Server} socket_io - The socket.io Server object.
 * @param {string} id - The socket id.
 * @returns {Socket | undefined} The socket object if found, undefined otherwise.
 */
const getSocketById = (socket_io: Server, id: string): Socket | any => {
  const list_socket: any = socket_io.sockets;
  return Array.from(list_socket.values()).find(
    (s: any) => s.id.toString() === id.toString()
  );
};
/**
 * Validate the authorization token in the socket connection.
 * This middleware checks if the 'Authorization' header exists,
 * and if the token is valid, it assigns the user object to the socket object.
 * If the token is invalid, it sends an "Unauthorized" error.
 *
 * @param {Socket} socket - The socket object.
 * @param {NextFunction} next - The next function in the middleware chain.
 * @returns {Promise<void>} A promise that resolves if the token is valid, or rejects with an error if the token is invalid.
 */
const validateAccessSocket = async (socket: any, next: NextFunction) => {
  let userExists = false;
  const code_auth = socket.handshake.headers.authorization;
  if (!code_auth) {
    return next(new Error("Unauthorized"));
  }
  if (code_auth) {
    const value_token = getTokenValue(code_auth);
    if (!value_token) {
      return next(new Error("Unauthorized"));
    }

    let user = await mongoose.model("User").findOne({ _id: value_token });
    if (!user) {
      return next(new Error("Unauthorized"));
    } else {
      socket["current_user"] = user;
      socket.id = value_token;
      userExists = true;
      return next();
    }
  }
};

export { getSocketById, validateAccessSocket };
