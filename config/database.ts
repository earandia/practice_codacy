import mongoose, { ConnectOptions } from 'mongoose';

interface DatabaseConfig {
  url: string;
  properties: ConnectOptions;
}

const config: { database: DatabaseConfig } = {
  database: {
    url: process.env.DATABASE_URL || '', 
    properties: {
      dbName: process.env.DB_NAME,
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 60000,   
    },
  },
};

let isConnected: boolean = false;

/**
 * Establishes a connection to the database.
 *
 * If the connection is already established, the function simply returns without
 * attempting to reconnect.
 *
 * @returns {Promise<void>} - A promise that resolves when the connection is
 * established, or rejects when an error occurs.
 */
const connectToDatabase = async (): Promise<void> => {
  if (isConnected) {
    console.log("Already connected to the database.");
    return;
  }

  try {
    await mongoose.connect(config.database.url, config.database.properties);
    isConnected = true;
    console.log("Connection with database succeeded.");
  } catch (error) {
    console.error('Connection error:', error);
  }
};

export default connectToDatabase;
