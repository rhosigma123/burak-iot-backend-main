import { Request, Response } from 'express';
import { prisma } from '../../client';
import { LeaveType, Prisma } from '@prisma/client';
import { getManagerIdByUserId } from '../../services/managerService';

export const viewCreateLeave = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, reason, leaveType } = req.body;

    const userId = (req as any).user.userId

    if (leaveType !in LeaveType){
      res.status(500).json({ message: "Requested Leave Type is invalid." });
    }

    const leave = await prisma.leave.create({
      data: {
        userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        leaveType,
      }
    })

    res.status(201).json({ message: 'Leave created successfully', leave });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewUpdatedLeave = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, reason, leaveType } = req.body;
    const { id } = req.params;
    const userId = (req as any).user.userId

    if (leaveType !in LeaveType){
      res.status(500).json({ message: "Requested Leave Type is invalid." });
    }

    const leave = await prisma.leave.update({
      where: {id: parseInt(id)},
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        leaveType,
      }
    })

    res.status(202).json({ message: 'Leave updated successfully', leave });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewLeaves = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId

    const leaves = await prisma.leave.findMany({
      where: { userId: userId },
      orderBy: { id: 'desc' },
    });

    if (!leaves) {
      return res.status(404).json({ message: 'Leaves not found' });
    }

    res.status(200).json(leaves);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewLeaveById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId

    const leave = await prisma.leave.findUnique({
      where: { id: parseInt(id), userId: userId },
    });

    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    res.status(201).json(leave);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewEmployeesLeave = async (req: Request, res: Response) => {
  try {
    const { empId } = req.params;
    const userId = (req as any).user.userId
    const managerId = await getManagerIdByUserId(userId);

    const leaves = await prisma.leave.findMany({
      where: { id: parseInt(empId) },
      orderBy: {
        id: "desc"
      }
    });
    if (!leaves) {
      return res.status(404).json({ message: 'Employee Leaves not found' });
    }

    res.status(200).json(leaves);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewEmployeeLeaveById = async (req: Request, res: Response) => {
  try {
    const { empId, id } = req.params;
    const userId = (req as any).user.userId
    const managerId = await getManagerIdByUserId(userId);

    const leave = await prisma.leave.findUnique({
      where: {
        id: parseInt(empId),
        userId: parseInt(empId),
      },
    });

    if (!leave) {
      return res.status(404).json({ message: 'Employee leave not found' });
    }
    res.status(201).json(leave);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewDeleteLeave = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId

    await prisma.leave.delete({
      where: { id: parseInt(id), userId: userId },
    });

    res.status(201).json({ message: 'Leave deleted successfully' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ message: 'Leave not found' });
    }
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};