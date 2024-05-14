import { Request, Response } from 'express';
import { prisma } from '../../client';
import { Prisma } from '@prisma/client';
import { updateOfficer } from '../../services/officerService';
import { getManagerIdByUserId } from '../../services/managerService';

export const viewOfficerProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId
    
    const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
    });

    if (!user) res.status(201).json({message: "User is not an Employee"})
    res.status(201).json({ message: 'Employee retrieved successfully', user });
  } catch (error) {
      if (error instanceof Error) {
          res.status(500).json({ message: error.message });
      } else {
          res.status(500).json({ message: 'An unknown error occurred' });
      }
  }
};

export const viewUpdateOfficer = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, designation, dob } = req.body;
    const { id } = req.params
    let profilePic = null;

    if (req.files && typeof req.files === 'object') {
      if ('profilePic' in req.files && req.files.profilePic) {
        profilePic = `/uploads/${req.files.profilePic[0].filename}`;
      }
    }
    const userId = (req as any).user.userId
    const managerId = await getManagerIdByUserId(userId)

    const user = await updateOfficer( parseInt(id), managerId, profilePic, fullName, email, phone, designation, dob);
    res.status(201).json({ message: 'Officer registered successfully', user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewOfficers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId
    const managerId = await getManagerIdByUserId(userId);

    const officers = await prisma.officer.findMany({
      where: { managerId: managerId },
      select: {
        id: true,
        User: {
          select: {
            id: true,
            profilePic: true,
            fullName: true,
            email: true,
            phone: true,
            designation: true,
            dob: true,
          }
        }
      }
    });
    if (!officers) {
      return res.status(404).json({ message: 'Officers not found' });
    }

    res.json(officers);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewOfficerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId
    const managerId = await getManagerIdByUserId(userId);

    const officer = await prisma.officer.findUnique({
      where: { id: parseInt(id), managerId: managerId },
      select: {
        id: true,
        User: {
          select: {
            id: true,
            profilePic: true,
            fullName: true,
            email: true,
            phone: true,
            designation: true,
            dob: true,
          }
        }
      }
    });

    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }
    res.json(officer);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewDeleteOfficer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.officer.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Officer deleted successfully' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ message: 'Officer not found' });
    }
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};