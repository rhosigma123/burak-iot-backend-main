import { prisma } from "../client";

export const updateManager = async (
  userId: number,
  fullName?: string,
  phone?: string,
  designation?: string,
  dob?: string,
  companyName?: string,
  logo?: string | null,
  companyEmail?: string,
  companyPhone?: string,
  companyIndustry?: string,
  companyAddress?: string,
  profilePic?: string | null,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { Manager: true },
    });

    if (!user || !user.Manager) {
      throw new Error('Manager not found');
    }

    const manager = await prisma.user.update({
      where: { id: userId },
      data: { fullName, phone, ...(profilePic && { profilePic}), designation, dob },
    });

    if (companyName || logo || companyEmail || companyPhone || companyIndustry || companyAddress) {
      await prisma.company.update({
        where: { id: Number(user.Manager.companyId) },
        data: {
          name: companyName,
          ...(logo && { logo}),
          email: companyEmail,
          phone: companyPhone,
          industry: companyIndustry,
          address: companyAddress,
        },
      });
    }

    return manager;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update manager');
  }
};

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