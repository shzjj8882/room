import express from 'express';
import http from 'http';
import router from './route';
import dotenv from 'dotenv';
import socketRouter from './socketRouter';
import { logger } from './utils';
process.env.NODE_ENV && dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();
const port =
  process.env.PORT ?? 80

router(app);
const server = http.createServer(app);
socketRouter(server);

server.listen(port, () => {
  logger.serverDebug(`listening on port: ${port}`);
})
