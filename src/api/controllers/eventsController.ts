import { Request, Response } from 'express';
import { prisma } from '../../client';
import { Prisma } from '@prisma/client';
import { getManagerIdByUserId } from '../../services/managerService';

export const viewCreateCalendarEvent = async (req: Request, res: Response) => {
  try {
    const { date, eventName, description } = req.body;

    const userId = (req as any).user.userId
    const managerId = await getManagerIdByUserId(userId);

    const calendarEvent = await prisma.calendarEvent.create({
      data: {
        managerId,
        date: new Date(date),
        eventName,
        description,
      }
    })

    res.status(201).json({ message: 'Calendar Event created successfully', calendarEvent });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewUpdatedCalendarEvent = async (req: Request, res: Response) => {
  try {
    const { date, eventName, description } = req.body;
    const { id } = req.params;
    const userId = (req as any).user.userId
    const managerId = await getManagerIdByUserId(userId);

    const calendarEvent = await prisma.calendarEvent.update({
      where: {id: parseInt(id), managerId: managerId},
      data: {
        date: new Date(date),
        eventName,
        description,
      }
    })

    res.status(202).json({ message: 'Calendar Event updated successfully', calendarEvent });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewCalendarEvents = async (req: Request, res: Response) => {
  try {
    const calendarEvents = await prisma.calendarEvent.findMany({
      orderBy: { date: 'desc' },
    });

    res.status(200).json(calendarEvents);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewCalendarEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const calendarEvent = await prisma.calendarEvent.findUnique({
      where: { id: parseInt(id) },
    });

    if (!calendarEvent) {
      return res.status(404).json({ message: 'Calendar Event not found' });
    }

    res.status(201).json(calendarEvent);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewDeleteCalendarEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId
    const managerId = await getManagerIdByUserId(userId);

    await prisma.calendarEvent.delete({
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