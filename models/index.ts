import { Pagination } from "mongoose-paginate-ts";
import fs from "fs/promises"; 
import path from "path";

const models: Record<string, Pagination<any>> = {};

const loadModels = async (directory: string): Promise<void> => {
  try {
    const files = await fs.readdir(directory); 
    const modelPromises = files
      .map(async (file) => {
        const filePath = path.join(directory, file);
        const stat = await fs.stat(filePath);  

        if (stat.isDirectory()) {
          await loadModels(filePath);
        } else if (file.endsWith(".model.ts") || file.endsWith(".model.js")) {
          try {
            const model = await import(filePath);
            if (model?.default?.modelName) {
              models[model.default.modelName] = model.default;
            } else {
              console.error(`El archivo ${filePath} no contiene un modelo válido.`);
            }
          } catch (error) {
            console.error(`Error al importar el modelo desde ${filePath}:`, error);
          }
        }
      });

    await Promise.all(modelPromises);
  } catch (error) {
    console.error("Error al leer el directorio:", error);
  }
};

const initializeModels = async (): Promise<void> => {
  await loadModels(path.resolve(__dirname));
};

initializeModels()
  .then(() => {
    console.log("Models loaded successfully");
  })
  .catch((error) => {
    console.error("Error loading models", error);
  });

export default models;
