import { Request, Response } from 'express';
import { prisma } from '../../client';
import { Prisma } from '@prisma/client';
import { getManagerIdByUserId } from '../../services/managerService';

export const viewCreateDevice = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    // const userId = (req as any).user.userId
    // const managerId = await getManagerIdByUserId(userId);


    console.log(content)

    // const device = await prisma.device.create({
    //   data: {
    //     managerId,
    //     date: new Date(date),
    //     eventName,
    //     description,
    //   }
    // })
    req.app.get('io').emit('content', content);

    res.status(201).json({ message: 'Data Received created successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};





export const viewUpdatedDevice = async (req: Request, res: Response) => {
  try {
    const { date, eventName, description } = req.body;
    const { id } = req.params;
    const userId = (req as any).user.userId
    const managerId = await getManagerIdByUserId(userId);

    // const device = await prisma.device.update({
    //   where: {id: parseInt(id), managerId: managerId},
    //   // data: {
    //   //   date: new Date(date),
    //   //   eventName,
    //   //   description,
    //   // }
    // })

  res.status(202).json({ message: 'Calendar Event updated successfully',});
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewDevices = async (req: Request, res: Response) => {
  try {
    const devices = await prisma.telemetry.findMany({
      orderBy: { receivedAt: 'desc' },
    });

    res.status(200).json(devices);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewDeviceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const device = await prisma.telemetry.findUnique({
      where: { id: parseInt(id) },
    });

    if (!device) {
      return res.status(404).json({ message: 'Calendar Event not found' });
    }

    res.status(201).json(device);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewDeleteDevice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId
    const managerId = await getManagerIdByUserId(userId);

    await prisma.telemetry.delete({
      where: { id: parseInt(id), managerId: managerId },
    });

    res.status(200).json({ message: 'Calendar Event deleted successfully' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ message: 'Calendar Event not found' });
    }
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};