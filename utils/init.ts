import fs from 'fs';
import path from 'path';
interface SocketAction {
  ws_path: string;
}

interface ModuleIO {
  default: SocketAction;
}

/**
 * Reads all files in a given folder and calls addActions on each one
 * with the default export. If the module does not have a default export,
 * a warning is logged. If the module cannot be loaded, an error is logged.
 * @param socketIo The Socket.IO server to add actions to
 * @param prepend_url The URL to prepend to each action's path
 * @param folder The folder to read modules from
 * @returns The same Socket.IO server
 */
export default async function readControllersDirSocket(
  socketIo: any, 
  prepend_url: string, 
  folder: string
): Promise<any> {  // Updated return type to `Promise<any>`
  const table: string[][] = [];
  console.log("=====================SOCKETS======================");

  const base_path = path.join(__dirname, folder);
  const files = fs.readdirSync(base_path);
  for (const file of files) {
    try {
      const module: ModuleIO = await import(path.join(base_path, file));
      if (module && module.default) {
        socketIo.addActions(module.default);
        console.log(`socket`, `${prepend_url}${module.default.ws_path}`);
      } else {
        console.warn(`Module at ${file} does not export default action.`);
      }
    } catch (err) {
      console.error(`Failed to load module ${file}:`, err);
    }
  }
  
  socketIo.initializeConnection();
  return socketIo;
}
