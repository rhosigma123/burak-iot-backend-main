import { Request, Response } from 'express';
import { prisma } from '../../client';
import { Prisma } from '@prisma/client';
import { updateEmployee } from '../../services/employeeService';
import { getManagerIdByUserId } from '../../services/managerService';

export const viewEmployeeProfile = async (req: Request, res: Response) => {
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

export const viewUpdateEmployee = async (req: Request, res: Response) => {
  try {
    const { employeeId, fullName, email, phone, designation, department,  dob, bloodGroup, dateOfJoining } = req.body;
    const { id } = req.params
    let profilePic = null;

    if (req.files && typeof req.files === 'object') {
      if ('profilePic' in req.files && req.files.profilePic) {
        profilePic = `/uploads/${req.files.profilePic[0].filename}`;
      }
    }
    const userId = (req as any).user.userId
    const managerId = await getManagerIdByUserId(userId)

    const user = await updateEmployee( parseInt(id), employeeId, profilePic, fullName, email, phone, designation, department,  dob, bloodGroup, dateOfJoining );
    res.status(201).json({ message: 'Officer registered successfully', user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewEmployees = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId
    const managerId = await getManagerIdByUserId(userId);

    const employees = await prisma.employee.findMany({
      where: { managerId: managerId },
      select: {
        id: true,
        User: {
          select: {
            id: true,
            employeeId: true,
            profilePic: true,
            fullName: true,
            email: true,
            phone: true,
            designation: true,
            department: true,
            dob: true,
            bloodGroup: true,
            dateOfJoining: true,
          }
        }
      }
    });
    if (!employees) {
      return res.status(404).json({ message: 'Employees not found' });
    }

    res.json(employees);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewEmployeeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId
    const managerId = await getManagerIdByUserId(userId);

    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id), managerId: managerId },
      select: {
        id: true,
        User: {
          select: {
            id: true,
            employeeId: true,
            profilePic: true,
            fullName: true,
            email: true,
            phone: true,
            designation: true,
            department: true,
            dob: true,
            bloodGroup: true,
            dateOfJoining: true,
          }
        }
      }
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewDeleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.employee.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ message: 'Employees not found' });
    }
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};