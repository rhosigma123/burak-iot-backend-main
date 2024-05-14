import { prisma } from "../client";

export const getManagerIdByUserId = async (userId: any): Promise<any | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { Manager: { select: { id: true } } },
    });
    return user?.Manager?.id || null;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching ManagerId:', error.message);
      return null;
    } else {
      console.error('An unknown error occurred');
      return null;
    }
  }
};