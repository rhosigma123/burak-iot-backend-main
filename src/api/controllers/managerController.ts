import { prisma } from '../../client';
import { Request, Response } from 'express';
import { getManagerIdByUserId, updateManager } from '../../services/managerService';
import { Server } from 'socket.io';
import { TelemetryData } from '../../types/device';

export const viewUpdateManager = async (req: Request, res: Response) => {
    try {
        const {
            fullName,
            designation,
            dob,
            phone,
            companyName,
            companyEmail,
            companyPhone,
            companyIndustry,
            companyAddress,
        } = req.body;
        let logo = null;
        let profilePic = null;

        if (req.files && typeof req.files === 'object') {
            if ('logo' in req.files && req.files.logo) {
                logo = `/uploads/${req.files.logo[0].filename}`;
            }
            if ('profilePic' in req.files && req.files.profilePic) {
                profilePic = `/uploads/${req.files.profilePic[0].filename}`;
            }
        }
        const userId = (req as any).user.userId
        const manager = await updateManager(
            userId,
            fullName,
            phone,
            designation,
            dob,
            companyName,
            logo,
            companyEmail,
            companyPhone,
            companyIndustry,
            companyAddress,
            profilePic,
        );

        res.status(202).json(manager);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export const viewManagerProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId
        const managerId = await getManagerIdByUserId(userId)
        
        const manager = await prisma.manager.findUnique({
            where: { id: parseInt(managerId) },
            select: {
                id: true,
                User: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phone: true,
                        designation: true,
                        profilePic: true,
                        dob: true,
                    },
                },
                Company: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                        email: true,
                        phone: true,
                        industry: true,
                        address: true,
                    },
                },
            },
        });

        res.status(200).json(manager);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export const viewManagerDashboard = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId
      const managerId = await getManagerIdByUserId(userId);
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - 5 * 60 * 1000);
    
      const telemetries = await prisma.telemetry.findMany({
        where: {
          managerId: managerId,
          receivedAt: {
            gte: startTime,
            lte: endTime,
          },   
        },
        select: {
            flow: true,
            totalizer: true,
            temperature: true,
            level: true,
            receivedAt: true,
          },
      });
      if (!telemetries) {
        return res.status(404).json({ message: 'telemtries not found' });
      }
  
      res.json(telemetries);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  };

  
  export const handleMqttMessage = async (
    message: Buffer,
    io: Server
  ) => {
    try {
      const data: TelemetryData = JSON.parse(message.toString());
      if (data.dataType === 'telemetric') {
        const managerId = 1;
        if (managerId !== null) {
          const telemetryData = {
            // managerId: managerId,
            flow: data.Flow,
            totalizer: data.Totalizer,
            temperature: data.Temperature,
            level: data.Level,
            receivedAt: new Date(data.timeStamp),
          };
  
        //   const savedData = await prisma.telemetry.create({
        //     data: telemetryData,
        //   });
  
          io.emit('telemetryData', telemetryData);
        } else {
          console.error('Manager ID not found for device ID:', data.deviceId);
        }
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
};
  