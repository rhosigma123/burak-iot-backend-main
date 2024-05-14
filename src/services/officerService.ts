import { prisma } from "../client";


export const updateOfficer = async (
  id: number,
  managerId: number,
  profilePic: string | null,
  fullName: string,
  email: string,
  phone: string,
  designation: string,
  dob: string,
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
        ...(profilePic && { profilePic }),
        fullName,
        email,
        phone,
        designation,
        dob: new Date(dob),
      },
    });
    
    return user;
  }catch(error){
    console.error(error)
  }
};

export const getOfficerIdByUserId = async (userId: any): Promise<any | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { Officer: { select: { id: true } } },
    });
    return user?.Officer?.id || null;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching Officer Id:', error.message);
      return null; 
    } else {
      console.error('An unknown error occurred');
      return null; 
    }
  }
};