// import { get_param } from "./params";
// import { Request, Response, NextFunction } from "express";
// import fs from "fs";
// import path from "path";
// // import multer from "multer";
// import {
//   CustomSanitizer,
//   validationResult,
// } from "express-validator";
// import { randomBytes } from "crypto";
// type UploadedFile = {
//   originalFilename: string; // Original name of the file
//   originalname: string; // Original name of the file
//   filename?: string; // Renamed file name upon storage
//   path: string; // Temporary storage path
//   mimetype: string; // MIME type of the file (e.g., 'image/png')
//   size: number; // Size of the file in bytes
//   encoding?: string; // Encoding type (e.g., '7bit', 'binary')
//   fieldname?: string; // Form field name that uploaded the file
//   buffer?: Buffer; // In-memory buffer for the file (if not stored on disk)
//   type: string; // General file type (e.g., 'file', 'image', etc.)
//   headers: any; // HTTP headers of the uploaded file
// };

// type UploadOptions = {
//   option?: any;
//   destination?: any;
// };
// /**
//  * Middleware function for handling file uploads.
//  * 
//  * This function returns an Express middleware that invokes the provided
//  * `uploadUserProfilePictureApi` function for processing file uploads.
//  * 
//  * @param {Function} uploadUserProfilePictureApi - The API function responsible for handling
//  *    the upload of user profile pictures. It takes in the request, response, next function,
//  *    and upload options as parameters.
//  * @param {UploadOptions} options - Options for customizing the file upload behavior. This can
//  *    include destination paths and other upload configurations.
//  * 
//  * @returns {Function} An Express middleware function that processes file uploads.
//  */
// const uploadFiles = (
//   uploadUserProfilePictureApi: (
//     req: Request,
//     res: Response,
//     next: NextFunction,
//     options: UploadOptions
//   ) => void,
//   options: UploadOptions
// ) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     uploadUserProfilePictureApi(req, res, next, options);
//   };
// };
// /**
//  * Retrieves the value at a given path within a nested object.
//  * 
//  * @param {any} obj - The object from which to retrieve the value.
//  * @param {string} path - A dot-separated string representing the path to the desired value.
//  * 
//  * @returns {any | undefined} The value at the specified path, or `undefined` if the path does not exist.
//  */
// const getPropertyPath = (obj: any, path: string) => {
//   if (!path) return undefined;

//   const properties = path.split(".");
//   let current = obj;

//   for (const prop of properties) {
//     if (!current || !Object.prototype.hasOwnProperty.call(current, prop)) {
//       return undefined;
//     }
//     current = current[prop];
//   }

//   return current;
// };
// /**
//  * Sets the value at a given path within a nested object. If the path does not exist, it will be created.
//  * 
//  * @param {any} obj - The object in which to set the value.
//  * @param {string} path - A dot-separated string representing the path to the value to be set.
//  * @param {any} value - The value to be set at the given path.
//  */
// const setPropertyPath = (obj: any, path: string, value: any) => {
//   const properties = path.split(".");
//   let current = obj;

//   for (let i = 0; i < properties.length - 1; i++) {
//     const prop = properties[i];
//     if (!current[prop]) {
//       current[prop] = {};
//     }
//     current = current[prop];
//   }
//   current[properties[properties.length - 1]] = value;
// };
// /**
//  * Generates a 6-character random string to be used as a filename.
//  * 
//  * The generated string is a hexadecimal representation of a 3-byte random value.
//  * 
//  * @returns {string} A 6-character random string.
//  */
// const generateFileName = (): string => {
//   const hash = randomBytes(3).toString("hex");
//   return `${hash.substring(0, 6)}`;
// };

// /**
//  * Retrieves a profile picture from the given request. The picture can be contained in the body of the request
//  * as a base64-encoded string, or it can be uploaded as a file in the request.
//  * 
//  * @param {Request} req - The request from which to retrieve the profile picture.
//  * 
//  * @returns {string | UploadedFile | undefined} The retrieved profile picture, or undefined if no profile picture is found.
//  */
// const getImageFromRequest = (
//   req: Request
// ): string | UploadedFile | undefined => {
//   const profilePicture = req.body["user"]["profile_picture"];
//   const files = (req.files as any)?.["user"]["profile_picture"];
//   if (profilePicture) {
//     return profilePicture;
//   }

//   if (Array.isArray(files) && files.length > 0) {
//     return files[0];
//   }

//   return undefined;
// };
// /**
//  * Retrieves a profile picture from the given request. The picture can be contained in the body of the request
//  * as a base64-encoded string, or it can be uploaded as a file in the request.
//  *
//  * @param {Request} req - The request from which to retrieve the profile picture.
//  * @param {UploadOptions} options - An options object containing the path to the profile picture
//  * in the request body and files.
//  *
//  * @returns {string | UploadedFile | UploadedFile[] | undefined} The retrieved profile picture, or undefined if no profile picture is found.
//  */
// const getImageFromRequestApi = async (
//   req: Request,
//   options: UploadOptions
// ): Promise<string | UploadedFile | UploadedFile[] | undefined> => {
//   const profilePicture = getPropertyPath(req.body, options.option);
//   const files = getPropertyPath(req.files, options.option);

//   if (
//     profilePicture &&
//     typeof profilePicture === "string" &&
//     profilePicture.toString().match(/data:image\/([a-zA-Z]*);base64,([^"]*)/) !=
//       null
//   ) {
//     return profilePicture;
//   }
//   if (
//     files &&
//     typeof files === "object" &&
//     "originalFilename" in files &&
//     !Array.isArray(files)
//   ) {
//     return files as UploadedFile;
//   }
//   if (Array.isArray(files) && files.length > 0) {
//     return files as UploadedFile[];
//   }

//   return undefined;
// };

// /**
//  * Validates the request, retrieves the image from the request, uploads it to the server, and saves the file path to the request body.
//  * 
//  * This middleware should be used after the validation middleware, and before the controller that handles the request.
//  * 
//  * @param {Request} req - The request object containing the uploaded file and any other data sent by the client.
//  * @param {Response} res - The response object to send a response back to the client (not used in this function).
//  * @param {NextFunction} next - The next middleware function to be called once the file upload and processing are complete.
//  */
// const uploadUserProfilePicture = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const errors = validationResult(req);
//   if (errors.isEmpty()) {
//     const user = get_param(req, "user") as any;

//     if (user) {
//       const image = getImageFromRequest(req);

//       if (image) {
//         req.body["user"]["profile_picture"] = upload_image(image, "users");
//       }
//     }
//   }
//   next();
// };

// /**
//  * Validates the request, retrieves the image from the request, uploads it to the server, and saves the file path to the request body.
//  * 
//  * @param {Request} req - The request object containing the uploaded file and any other data sent by the client.
//  * @param {Response} res - The response object to send a response back to the client (not used in this function).
//  * @param {NextFunction} next - The next middleware function to be called once the file upload and processing are complete.
//  * @param {UploadOptions} options - Options for customizing the file upload behavior:
//  *  - `destination` (string): The destination folder where the file will be uploaded.
//  *  - `option` (string): The property in the request body where the file path will be stored.
//  * 
//  * @returns {void} This function doesn't return anything; it modifies the `req.body` to include the file path.
//  * 
//  * @example
//  * // Example usage in an Express.js route
//  * app.post('/upload', (req, res, next) => uploadFileApi(req, res, next, {
//  *   destination: 'uploads/images',
//  *   option: 'imageUrl'
//  * }), (req, res) => {
//  *   res.json({ message: 'File uploaded successfully', filePath: req.body.imageUrl });
//  * });
//  */

// const uploadFileApi = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
//   options: UploadOptions
// ) => {
//   const errors = validationResult(req);
//   if (errors.isEmpty()) {
//     let image = (await getImageFromRequestApi(req, options)) as
//       | string
//       | UploadedFile
//       | UploadedFile[]
//       | undefined;
//     if (image) {
//       if (Array.isArray(image)) {
//         const filePaths = await Promise.all(
//           image.map((file) => upload_image(file, options.destination))
//         );
//         setPropertyPath(req.body, options.option, filePaths);
//       } else {
//         let value = upload_image(image, options.destination);
//         setPropertyPath(req.body, options.option, value);
//       }
//     }
//   }
//   next();
// };

// /**
//  * Processes images from different sources (body, query, params, or files), 
//  * uploads them to the server, and returns the file paths of the uploaded images.
//  *
//  * @param {string | string[] | File | File[]} input - The input data that may contain image files.
//  * @param {Object} param1 - An object containing the `req` and `path` properties:
//  *  - `req` (Request): The request object that contains data from different sources (body, query, params, or files).
//  *  - `path` (string): The path used to navigate within the `req` object to find the image.
//  * 
//  * @returns {Promise<string | string[] | undefined>} A promise that resolves with the file path(s) of the uploaded image(s), or `undefined` if no image is found.
//  * 
//  * @example
//  * // Example usage in a middleware:
//  * const filePaths = await fileSanitizer(input, { req, path: 'files.image' });
//  * console.log(filePaths); // Logs the file paths of uploaded images
//  */

// const fileSanitizer: CustomSanitizer = async (input, { req, path }) => {
//   const locations = ["body", "query", "params", "files"];
//   const array_path = path.split(".");
//   const search_image = locations.map((loc) => {
//     let base = req[loc];
//     const item = array_path.reduce(
//       (acc, key) => (acc ? acc[key] : undefined),
//       base
//     );
//     return item;
//   });
//   const image: string | string[] | File | File[] = search_image.find(
//     (i) => !!i
//   );
//   const folder_name = array_path[array_path.length - 1];
//   if (image) {
//     if (Array.isArray(image)) {
//       const filePaths: string[] | any = await Promise.all(
//         image.map((file) => upload_image(file, folder_name))
//       );
//       return filePaths;
//     } else {
//       let value: string | any = upload_image(image, folder_name);
//       return value;
//     }
//   }
// };

// /**
//  * Uploads the given image to the server and returns the file path of the uploaded image.
//  * This function supports both base64-encoded strings and `File` objects as input.
//  * The `folder` parameter allows you to specify the destination folder for the uploaded image.
//  * 
//  * @param {string | UploadedFile | File} image - The input image to be uploaded.
//  * @param {string} folder - The destination folder for the uploaded image. Defaults to "uploads".
//  * 
//  * @returns {string | UploadedFile | UploadedFile[] | undefined} The file path of the uploaded image, or `undefined` if no image is found.
//  */
// const upload_image = (
//   image: string | UploadedFile | File,
//   folder: string = "uploads"
// ): string | UploadedFile | UploadedFile[] | undefined => {
//   const fullPath = `uploads/${folder}`;

//   if (
//     typeof image === "string" &&
//     image.toString().match(/data:image\/([a-zA-Z]*);base64,([^"]*)/) != null
//   ) {
//     return save_image_base64(image, fullPath);
//   } else if (typeof image === "object" && "originalFilename" in image) {
//     return save_image_binary(image as UploadedFile, fullPath);
//   }
// };

// /**
//  * Saves the given base64-encoded image string to the server, and returns the file path of the saved image.
//  * This function creates a new folder if the given folder does not exist.
//  * 
//  * @param {string} file - The base64-encoded image string to be saved.
//  * @param {string} folder - The destination folder for the saved image. Defaults to "uploads".
//  * 
//  * @returns {string} The file path of the saved image.
//  */
// const save_image_base64 = (file: string, folder: string): string => {
//   const save_path = `../public/${folder}`;
//   const file_path = path
//     .join(__dirname, save_path)
//     .replace("helpers/", "public/");

//   if (!fs.existsSync(file_path)) {
//     fs.mkdirSync(file_path, { recursive: true });
//   }

//   const image = Date.now().toString();
//   const base64Data = file.replace(/^data:([A-Za-z-+/]+);base64,/, "");
//   const ext = file.substring(file.indexOf("/") + 1, file.indexOf(";base64"));
//   const hash = generateFileName();
//   const random = generateRandomString(5)
//   const new_path = path.join(file_path, `${image}_${hash}_${random}.${ext}`);

//   fs.writeFileSync(new_path, base64Data, "base64");

//   return `${folder}/${image}_${hash}_${random}.${ext}`;
// };

// /**
//  * Saves the given binary image file to the server, and returns the file path of the saved image.
//  * This function creates a new folder if the given folder does not exist.
//  * 
//  * @param {UploadedFile} file - The binary image file to be saved.
//  * @param {string} folder - The destination folder for the saved image. Defaults to "uploads".
//  * 
//  * @returns {string} The file path of the saved image.
//  */
// const save_image_binary = (file: UploadedFile, folder: string): string => {
//   const save_path = `../public/${folder}`;
//   const file_path = path
//     .join(__dirname, save_path)
//     .replace("helpers/", "public/");

//   if (!fs.existsSync(file_path)) {
//     fs.mkdirSync(file_path, { recursive: true });
//   }

//     const date = new Date().toLocaleDateString().replace(/[/]/g, '');
//     const time = new Date().toLocaleTimeString().replace(/[:, PM, AM]/g, '');
//     const file_name = generateRandomString(8);
//     const image = `${file_name}-${date}${time}${path.extname(file.originalFilename as string)}`;

//   try {
//     fs.copyFileSync(file.path, path.join(file_path, image));
//     return `${folder}/${image}`;
//   } catch (e) {
//     console.error(e);
//     return "";
//   }
// };

// /**
//  * Generates a random string of numbers with a given length.
//  * @param {number} length - The length of the random string. Defaults to 8.
//  * @returns {string} A random string of numbers.
//  */
// const generateRandomString = (length: number = 8): string => {
//   const charset = "0123456789";
//   let retVal = "";
//   for (let i = 0, n = charset.length; i < length; ++i) {
//     retVal += charset.charAt(Math.floor(Math.random() * n));
//   }
//   return retVal;
// };

// export {
//   uploadUserProfilePicture,
//   uploadFileApi,
//   upload_image,
//   fileSanitizer,
//   generateRandomString,
//   uploadFiles,
// };
