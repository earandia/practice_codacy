// import config from "../config/variables";
// import models from "../models";
// import { Server as HttpServer } from "http";
// // import { Server, Socket, Namespace } from "socket.io";

// interface SocketAction {
//   ws_path: string;
//   ws_validations: ((socket: Socket, next: (err?: any) => void) => void)[];
//   ws_accept_event: ((event: string) => Promise<boolean>) | string[];
//   ws: (socket: Socket, route_socket: Namespace, context: SocketContext) => void;
// }

// interface SocketContext {
//   global_io: any;
//   models: typeof models;
// }

// class WebSockets {
//   io: Server | null = null;
//   actions: SocketAction[] = [];

//   constructor(server?: HttpServer) {
//     if (server) {
//       this.io = new Server(server, {
//         connectionStateRecovery: {},
//         cors: {
//           origin: process.env.HOST_URL,
//           methods: ["GET", "POST"],
//         },
//       });
//       console.log("Socket.IO initialized:");
//     }
//   }

//   addActions(action: SocketAction) {
//     this.actions.push(action);
//   }

//   /**
//    * Initializes the socket connection.
//    *
//    * This method is responsible for initializing the socket connection, and
//    * registering all the actions that were added using the `addActions` method.
//    *
//    * It will iterate over all the actions and call the `ws_validations` method
//    * for each one. If any of the validations fail, the socket connection will be
//    * closed.
//    *
//    * After validating the socket connection, it will register the `ws` method
//    * for each action.
//    *
//    * This method should only be called once, after all the actions have been
//    * added.
//    */
//   initializeConnection() {
//     this?.io?.on("connection", (socket) => {
//       socket.disconnect(true);
//     });
//     this.actions.forEach((action) => {
//       const routePath = config.socket_io_url + action.ws_path;
//       const route_socket = this.io?.of(routePath);
//       route_socket?.use((socket, next) => {
//         if (action.ws_validations.length > 0) {
//           for (const validation of action.ws_validations) {
//             validation(socket, next);
//           }
//         } else {
//           next();
//         }
//       });

//       route_socket?.on("connection", (socket) => {
//         socket.onAny(async (event) => {
//           if (typeof action.ws_accept_event === "function") {
//             const accept = await action.ws_accept_event(event);
//             if (!accept) {
//               socket.emit("error", { message: "Invalid event" });
//               socket.disconnect(true);
//             }
//           } else if (Array.isArray(action.ws_accept_event)) {
//             if (!action.ws_accept_event.includes(event)) {
//               socket.emit("error", { message: "Invalid event" });
//               socket.disconnect(true);
//             }
//           }
//         });

//         action.ws(socket, route_socket, { global_io: this.io, models });
//       });
//     });
//   }
// }

// let socket_io: Server | null = null;

// /**
//  * Initializes Socket.IO with the given HTTP server.
//  *
//  * @param {HttpServer} server The HTTP server to initialize Socket.IO with.
//  * @returns {WebSockets} The WebSockets instance that was created.
//  */
// function initSocketIO(server: HttpServer): WebSockets {
//   const socket_item = new WebSockets(server);
//   socket_io = socket_item.io;
//   return socket_item;
// }

// /**
//  * Retrieves the initialized Socket.IO server instance.
//  *
//  * @throws {Error} If Socket.IO has not been initialized.
//  * @returns {Server} The Socket.IO server instance.
//  */
// function getSocketIo(): Server {
//   if (!socket_io) {
//     throw new Error("Socket.IO not initialized");
//   }
//   return socket_io;
// }

// export { WebSockets, initSocketIO, getSocketIo };
