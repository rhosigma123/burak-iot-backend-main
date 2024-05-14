import { Request, Response } from 'express';
import { prisma } from '../../client';
import { AttendanceStatus, Prisma } from '@prisma/client';
import { updateEmployee } from '../../services/employeeService';
import { getManagerIdByUserId } from '../../services/managerService';

export const viewPunchIn = async (req: Request, res: Response) => {
  try {
    const { punchInTime, punchInLatitude, punchInLongitude, punchInLocation } = req.body;

    const userId = (req as any).user.userId

    const punchInDateTime = new Date(punchInTime);

    const currentDateUTC = new Date();

    const offsetIST = 5.5 * 60 * 60 * 1000;

    const currentDateIST = new Date(currentDateUTC.getTime() + offsetIST);
    const timeDifferenceMinutes = Math.abs((currentDateIST.getTime() - punchInDateTime.getTime()) / (1000 * 60));

    const nearbyTimeThresholdMinutes = 5;

    if (timeDifferenceMinutes > nearbyTimeThresholdMinutes || timeDifferenceMinutes < -nearbyTimeThresholdMinutes) {
      return res.status(400).json({ error: "Punch-in time is not nearby the current time." });
    }

    // const recentPunchIn = await prisma.attendance.findFirst({
    //   where: {
    //     userId,
    //     punchInTime: {
    //       gte: new Date(currentDateIST.getFullYear(), currentDateIST.getMonth(), currentDateIST.getDate()),
    //       lte: currentDateIST,
    //     },
    //   }, 
    //  });

    // if (recentPunchIn) {
    //   return res.status(400).json({ error: "Duplicate Punch In detected. Please wait before punching in again." });
    // }

    const punch = await prisma.attendance.create({
      data: {
        userId, 
        punchInTime: punchInDateTime,
        punchInLatitude: parseFloat(punchInLatitude),
        punchInLongitude: parseFloat(punchInLongitude),
        punchInLocation,
        status: AttendanceStatus.PRESENT
      },
    });

    res.status(201).json({ message: 'Attendance Punched In successfully', punch });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewPunchOut = async (req: Request, res: Response) => {
  try {
    const { punchOutTime, punchOutLatitude, punchOutLongitude, punchOutLocation } = req.body;

    const userId = (req as any).user.userId;

    const punchOutDateTime = new Date(punchOutTime);

    const currentDateUTC = new Date();

    const offsetIST = 5.5 * 60 * 60 * 1000;

    const currentDateIST = new Date(currentDateUTC.getTime() + offsetIST);

    const timeDifferenceMinutes = Math.abs((currentDateIST.getTime() - punchOutDateTime.getTime()) / (1000 * 60));

    const nearbyTimeThresholdMinutes = 5;

    if (timeDifferenceMinutes > nearbyTimeThresholdMinutes || timeDifferenceMinutes < -nearbyTimeThresholdMinutes) {
      return res.status(400).json({ error: "Punch Out time is not nearby the current time." });
    }

    const punchInRecord = await prisma.attendance.findFirst({
      where: {
        userId,
        punchInTime: {
          gte: new Date(currentDateIST.getFullYear(), currentDateIST.getMonth(), currentDateIST.getDate()),
          lte: currentDateIST,
        },
      },
    });

    if (!punchInRecord) {
      return res.status(400).json({ error: "No Punch In record found for the current date." });
    }

    // if (punchInRecord.punchOutTime) {
    //   return res.status(400).json({ error: "Punch Out already recorded for the current punch-in." });
    // }

    const punch = await prisma.attendance.update({
      where: {
        id: punchInRecord.id,
      },
      data: {
        punchOutTime: punchOutDateTime,
        punchOutLatitude: parseFloat(punchOutLatitude),
        punchOutLongitude: parseFloat(punchOutLongitude),
        punchOutLocation
      },
    });

    res.status(201).json({ message: 'Attendance Punched Out successfully', punch });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewUpdateAttendance = async (req: Request, res: Response) => {
  try {
    const { id, punchInTime, punchInLatitude, punchInLongitude, punchInLocation, punchOutTime, punchOutLatitude, punchOutLongitude, punchOutLocation, status } = req.body;

    const userId = (req as any).user.userId

    const punch = await prisma.attendance.update({
      where: { id: parseInt(id) },
      data: {
        punchInTime,
        punchInLatitude,
        punchInLongitude,
        punchInLocation,
        punchOutTime,
        punchOutLatitude,
        punchOutLongitude,
        punchOutLocation,
        status
      },
    });

    res.status(201).json({ message: 'Attendance updated successfully', punch });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewAttendances = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId

    const attendances = await prisma.attendance.findMany({
      where: { userId: userId },
      orderBy: { id: 'desc' },
    });

    if (!attendances) {
      return res.status(404).json({ message: 'Attendances not found' });
    }

    res.status(201).json(attendances);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewAttendanceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId

    const attendance = await prisma.attendance.findUnique({
      where: { id: parseInt(id), userId: userId },
    });

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }

    res.status(201).json(attendance);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewEmployeesAttendance = async (req: Request, res: Response) => {
  try {
    const { empId } = req.params;
    const userId = (req as any).user.userId
    const managerId = await getManagerIdByUserId(userId);

    const attendances = await prisma.employee.findUnique({
      where: { id: parseInt(empId), managerId: managerId },
      select: {
        User: {
          select: {
            Attendance: {
              orderBy: { id: 'desc' },
            },

          }
        }
      }
    });
    if (!attendances) {
      return res.status(404).json({ message: 'Attendances not found' });
    }

    res.status(201).json(attendances.User.Attendance);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewEmployeeAttendanceById = async (req: Request, res: Response) => {
  try {
    const { empId, id } = req.params;
    const userId = (req as any).user.userId
    const managerId = await getManagerIdByUserId(userId);

    const attendance = await prisma.employee.findUnique({
      where: {
        id: parseInt(empId),
        managerId: managerId
      },
      select: {
        User: {
          select: {
            Attendance: {
              where: {
                id: parseInt(id),
              },
            },
          }
        }
      },
    });

    if (!attendance) {
      return res.status(404).json({ message: 'Employee Attendance not found' });
    }
    res.status(200).json(attendance.User.Attendance);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewDeleteAttendance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.attendance.delete({
      where: { id: parseInt(id) },
    });

    res.status(201).json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ message: 'Attendance not found' });
    }
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};