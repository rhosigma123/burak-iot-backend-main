import express, { Express } from 'express';
import cors from 'cors';
import authRoutes from './api/routes/authRoutes';
import managerRoutes from './api/routes/managerRoutes';
import employeeRoutes from './api/routes/employeeRoutes';

const createApp = (): Express => {
  const app = express();

  app.use(cors())
  app.use(express.static('./public'));
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json());
  
  app.use('/api/auth', authRoutes);
  app.use('/api', managerRoutes);
  app.use('/api', employeeRoutes);

  return app;
};

export default createApp;
