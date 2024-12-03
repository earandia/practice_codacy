import { importAllFiles } from "./util";
import path from "path";
import { Router, Request, Response } from "express";
import { colors, paint } from "../utils/painter";
import { Server as SocketIOServer } from "socket.io";
import config from "../config/variables";
// const files_admin = importAllFiles(
//   path.resolve(__dirname, "../api/admin/v1/controllers"),
//   "admin"
// );
const files_api = importAllFiles(
  path.resolve(__dirname, "../api/v1/controllers"),
  "api"
);

type HttpMethod = "get" | "post" | "put" | "delete";

interface Controller {
  method: HttpMethod;
  url: string;
  validator?: any;
  controller: (
    req: Request,
    res: Response
  ) => Promise<void> | void;
}

const router = Router();

/* const files_api = importAllFiles(
  path.resolve(__dirname, "../api/admin/v1/controllers"),
  "api"
); */
/**
 * @description Loads all the controllers from the controllers folder.
 * It will get all the folders inside the controllers folder and for each folder
 * it will load all the files inside it.
 * @param {SocketIOServer} io the Socket.IO server instance
 * @returns {Promise<Router>} A promise with the router instance
 */
const loadRoutes = async (): Promise<Router> => {
  await Promise.all([
    // createRoutes(files_admin, io, config.admin_api_url as string),
    createRoutes(files_api,  config.api_url as string),
  ]);
  return router;
};

/**
 * Asynchronously creates and configures routes for a given set of controllers.
 * Each controller is expected to have an HTTP method, URL, optional validator, 
 * and a controller function that handles the request.
 *
 * @param files - A promise that resolves to an array of Controller objects.
 * @param io - The Socket.IO server instance used for handling WebSocket connections.
 * @param base_path - The base path to prepend to each controller's URL.
 * @returns A promise that resolves to an Express Router instance or any other value.
 */
const createRoutes = async (
  files: any,
  base_path: string
): Promise<Router | any> => {
  const controllers: Controller[] = await files;
  for (const controller of controllers) {
    configureRoute(
      controller.method,
      controller.url,
      base_path,
      controller.validator,
      controller.controller
    );
  }
};

/**
 * Configures an Express route with the specified HTTP method, URL, and controller function.
 * It also logs the route information with a colored method indication.
 * 
 * @param method - The HTTP method (e.g., 'get', 'post', 'put', 'delete') for the route.
 * @param url - The URL path for the route.
 * @param base_path - The base path to be prepended to the route's URL.
 * @param validator - An optional validation middleware for the route.
 * @param controllerFn - The controller function that handles the request.
 * @param io - The Socket.IO server instance used for handling WebSocket connections.
 */
const configureRoute = (
  method: HttpMethod,
  url: string,
  base_path: string,
  validator: any,
  controllerFn: (req: Request, res: Response) => void
): void => {
  const api_url = base_path + url;
  router[method](api_url, validator, (req: Request, res: Response) =>
    controllerFn(req, res)
  );
  const methodColor = paintMethod(method);
  console.log(
    `${methodColor} \t\t| ${paint("->", colors.fg.yellow)} \t\t| ${paint(
      api_url,
      colors.fg.blue
    )}`
  );
};

/**
 * Function to format the HTTP method in a colorful way.
 * @param {HttpMethod} method - The HTTP method to be formatted.
 * @returns {string} The formatted HTTP method.
 */
const paintMethod = (method: HttpMethod): string => {
  const methodColors: { [key in HttpMethod]: string } = {
    POST: paint(paint("POST", colors.fg.orange), colors.bg.lightYellow),
    GET: paint(paint("GET", colors.fg.green), colors.bg.lightGreen),
    DELETE: paint(paint("DELETE", colors.fg.red), colors.bg.lightRed),
    PUT: paint(paint("PUT", colors.fg.blue), colors.bg.lightBlue),
  } as any;

  const formattedMethod = method.toUpperCase() as HttpMethod;

  return (
    methodColors[formattedMethod] ||
    paint(paint(formattedMethod, colors.fg.magenta), colors.bg.lightMagenta)
  );
};

export { loadRoutes };
