import { prisma } from "../client";


export const updateEmployee = async (
  id: number,
  employeeId: number,
  profilePic: string | null,
  fullName: string,
  email: string,
  phone: string,
  designation: string,
  department: string,
  dob: string,
  bloodGroup: string,
  dateOfJoining: string,
) => {
  try{
    const existingUser = await prisma.user.findUnique({
      where: {email},
    });
  
    if (existingUser) {
      throw new Error('Email already exists');
    }
  
    const user = await prisma.user.update({
      where: {
        id: id
      },
      data: {
        employeeId,
        ...(profilePic && { profilePic }),
        fullName,
        email,
        phone,
        designation,
        department,
        dob: new Date(dob),
        bloodGroup,
        dateOfJoining: new Date(dateOfJoining),
      },
    });
    
    return user;
  }catch(error){
    console.error(error)
  }
};

export const getEmployeeIdByUserId = async (userId: any): Promise<any | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { Employee: { select: { id: true } } },
    });
    return user?.Employee?.id || null;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching Employee Id:', error.message);
      return null; 
    } else {
      console.error('An unknown error occurred');
      return null; 
    }
  }
};