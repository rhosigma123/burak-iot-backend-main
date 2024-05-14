import express, { Express } from 'express';
import cors from 'cors';
import http from 'http';
import { Server, Socket } from 'socket.io';
import authRoutes from './api/routes/authRoutes';
import managerRoutes from './api/routes/managerRoutes';
import officerRoutes from './api/routes/officerRoutes';
import deviceRoutes from './api/routes/deviceRoutes';
import { CLIENT_URL } from './config';

const createApp = (): Express => {
    const app = express();
    const server = http.createServer(app);

    const io = new Server(server,
      {
        cors: {
          origin: CLIENT_URL,
        },
        transports: ["websocket", "polling"],
      }
    );

    app.use(cors());
    app.use(express.static('./public'));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    io.on('connection', (socket: Socket) => {
        console.log('A client connected.');

        socket.on('disconnect', () => {
            console.log('A client disconnected.');
        });
    });

    app.set('io', io);

    app.use('/api/auth', authRoutes);
    app.use('/api', managerRoutes);
    app.use('/api', officerRoutes);
    app.use('/api', deviceRoutes);

    return app;
};

export default createApp;