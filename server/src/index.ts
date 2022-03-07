import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import auth from './routes/auth';
import mongoose from 'mongoose';
import checkSession from './middleware/deserializeUser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import socket from './sockets/sockets';
import upload from './routes/upload';
import dashboard from './routes/dashboard';
import morgan from 'morgan';
import path from 'path';

const PORT = process.env.PORT || 8080;

dotenv.config();

mongoose.connect(process.env.MONGODB_URL as string, () => {
  console.log('Connected to DB');
});
const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORSORIGIN as string,
    credentials: true
  }
});

app.use(cors({ origin: process.env.CORSORIGIN as string, credentials: true }));
app.use(express.json());
app.use(
  morgan((process.env.NODE_ENV as string) === 'production' ? 'combined' : 'dev')
);

if ((process.env.NODE_ENV as string) === 'production') {
  // Handle React routing, return all requests to React app
  app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')));
  app.get('*', (_: Request, res: Response) => {
    res.sendFile(
      path.resolve(__dirname, '..', '..', 'client', 'out', 'index.html')
    );
  });
}
app.use(cookieParser());
app.use('/auth', auth);
app.use(checkSession);
app.use(dashboard);
app.use(upload);

//Server ports
httpServer.listen(PORT, async () => {
  console.log(`listening on port: ${PORT}`);
  socket({ io });
});
