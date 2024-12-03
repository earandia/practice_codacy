import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import config from "./config/variables";
import { colors, paint } from "./utils/painter";
import http from "http";
import bodyParser from "body-parser";
import formData from "express-form-data";
import { loadRoutes} from './routes';
import connectToDatabase from './config/database';
import fs from 'fs';
import path from "path";
// import { Server as SocketIOServer,Socket } from "socket.io";
// import { initSocketIO } from './utils/websocket';
import morgan from 'morgan';
import readControllersDirSocket from "./utils/init";
const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'w' });
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('combined', { stream: accessLogStream }));
}
app.use(cors({ origin: true, exposedHeaders: "*" }));
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));
app.use(bodyParser.text({ type: "text/html" }));
app.use(formData.parse());
app.use((req, res, next) => {
    const methods = req.method;
    const route = req.originalUrl;
    console.log(`📥 Request received : ${methods},${route}`);
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`finish: ${methods} ${paint(route, colors.bg.green)} - ${paint(duration.toString(), colors.fg.lightYellow)}ms`);
    });
    next();
});
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});;
const publicDir = path.join(__dirname, "/public");
const assets = path.join(__dirname, "/assets");
app.use(express.static(publicDir));
app.use(express.static(assets));
const server = http.createServer(app);
// const socketIo = initSocketIO(server);
const initializeServer = async () => {
    try {
        connectToDatabase();
        const router = await loadRoutes();
        // readControllersDirSocket(socketIo as any, config.socket_io_url as string, "../sockets");
       
        app.use(router);
        server.listen(config.port, () => {
            console.log(paint("Server is listening at:", colors.fg.green), paint(`http://localhost:${config.port}`, colors.fg.blue), paint(`(Press CTRL+C to stop)`, colors.fg.yellow));
        });
    } catch (error) {
        console.error('Error initializing server:', error);
    }
};
initializeServer();