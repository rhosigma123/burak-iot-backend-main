// Import required modules
import express, { Express } from 'express';
import cors from 'cors';
import http from 'http';
import { Server, Socket } from 'socket.io';
import authRoutes from './api/routes/authRoutes';
import managerRoutes from './api/routes/managerRoutes';
import officerRoutes from './api/routes/officerRoutes';
import deviceRoutes from './api/routes/deviceRoutes';
import { CLIENT_URL } from './config';
import * as mqtt from 'mqtt';
import { handleMqttMessage } from './api/controllers/managerController';

const createApp = (): { app: Express, server: http.Server } => {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: CLIENT_URL,
        },
        transports: ["websocket", "polling"],
    });

    app.use(cors());
    app.use(express.static('./public'));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    io.on('connection', (socket: Socket) => {
        console.log('A client connected.');

        socket.on('disconnect', () => {
            console.log('A client disconnected.');
        });

        // Handle errors
        socket.on('error', (error: Error) => {
            console.error('Socket error:', error);
        });
    });

    app.set('io', io);

    const brokerUrl = 'mqtt://broker.hivemq.com';

    const client = mqtt.connect(brokerUrl);

    client.on('connect', () => {
        console.log('Connected to MQTT broker');
        client.subscribe('Publish', (err: any) => {
            if (err) {
                console.error('Subscription error:', err);
            } else {
                console.log('Subscribed to topic:');
            }
        });
    });

    client.on('message', async (topic: string, message: Buffer) => {
        await handleMqttMessage(message, io);
    });

    client.on('error', (err: any) => {
        console.error('MQTT connection error:', err);
    });

    app.use('/api/auth', authRoutes);
    app.use('/api', managerRoutes);
    app.use('/api', officerRoutes);
    app.use('/api', deviceRoutes);

    return { app, server };
};

export default createApp;
