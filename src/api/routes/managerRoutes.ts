import { Router } from 'express';
import { authenticateToken, checkUserRole } from '../middlewares/authMiddleware';
import { viewDeleteEmployee, viewEmployeeById, viewEmployees, viewUpdateEmployee } from '../controllers/employeeController';
import { RoleType } from '@prisma/client';
import { viewEmployeeAttendanceById, viewEmployeesAttendance, viewUpdateAttendance } from '../controllers/attendanceController';
import { viewCalendarEventById, viewCalendarEvents, viewCreateCalendarEvent, viewDeleteCalendarEvent, viewUpdatedCalendarEvent } from '../controllers/eventsController';

const router = Router();

// Employees Management
router.put('/manager/update-employee', authenticateToken, checkUserRole(RoleType.MANAGER), viewUpdateEmployee);
router.get('/manager/employees', authenticateToken, checkUserRole(RoleType.MANAGER), viewEmployees);
router.get('/manager/employee/:id', authenticateToken, checkUserRole(RoleType.MANAGER), viewEmployeeById);
router.delete('/manager/delete-employee/:id', authenticateToken, checkUserRole(RoleType.MANAGER), viewDeleteEmployee)

// Attendance Management
router.get('/manager/employee/:empId/attendances', authenticateToken, checkUserRole(RoleType.MANAGER), viewEmployeesAttendance);
router.get('/manager/employee/:empId/attendances/:id', authenticateToken, checkUserRole(RoleType.MANAGER), viewEmployeeAttendanceById);
router.post('/manager/employee/:empId/update-attendance', authenticateToken, checkUserRole(RoleType.MANAGER), viewUpdateAttendance);


// Events Management
router.post('/manager/create-event', authenticateToken, checkUserRole(RoleType.MANAGER), viewCreateCalendarEvent);
router.put('/manager/update-event', authenticateToken, checkUserRole(RoleType.MANAGER), viewUpdatedCalendarEvent);
router.get('/manager/events', authenticateToken, checkUserRole(RoleType.MANAGER), viewCalendarEvents);
router.get('/manager/events/:id', authenticateToken, checkUserRole(RoleType.MANAGER), viewCalendarEventById);
router.delete('/manager/delete-event/:id', authenticateToken, checkUserRole(RoleType.MANAGER), viewDeleteCalendarEvent)


export default router;