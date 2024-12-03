var rfs = require("recursive-fs");
/**
 * Reads all files in a given folder and imports them.
 * @param {any} directory The path to the folder to read files from.
 * @param {string} name The name of the controller to read files for.
 * @returns {Promise<any[]>} A promise with an array of imported controllers.
 */
export async function importAllFiles(directory: any, name: string) {
  let { files } = await rfs.read(directory);
  const controllers: any = [];
  try {
    for (const file of files) {
      const controller = (await import(file)).default;
      controllers.push(controller);
    }
  } catch (error) {
    console.log(error);
  }
  return controllers;
}
