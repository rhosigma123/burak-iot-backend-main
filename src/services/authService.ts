import { prisma } from '../client';
import { hashPassword, comparePassword } from '../utils/hashPassword';
import { generateToken } from '../utils/generateToken';
import { RoleType } from '@prisma/client'


export const registerManager = async (
  fullName: string,
  email: string,
  phone: string,
  password: string,
  designation: string,
  dob: string,
  companyName: string,
  companyEmail: string,
  companyPhone: string,
  companyIndustry: string,
  companyAddress: string,
  logo: string | null,
  profilePic: string | null,
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email:email },
  });

  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await hashPassword(password);

  const company = await prisma.company.create({
    data: {
      name: companyName,
      logo: logo,
      email: companyEmail,
      phone: companyPhone,
      industry: companyIndustry,
      address: companyAddress,
    },
  });

  const user = await prisma.user.create({
    data: {
      designation,
      dob: new Date(dob),
      profilePic,
      fullName,
      email,
      phone,
      password: hashedPassword,
      roleType: RoleType.MANAGER,
      Manager: {
        create: {
          Company: { connect: { id: company.id } },
        },
      },
    },
  });

  return user;
};


export const registerOfficer = async (
  fullName: string,
  email: string,
  phone: string,
  password: string, 
  designation: string,
  profilePic: string | null,
  managerId: number,
  dob: string,
) => {
  const existingUser = await prisma.user.findUnique({
    where: {email},
  });

  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      phone,
      profilePic,
      designation,
      dob: new Date(dob),
      password: hashedPassword,
      roleType: RoleType.OFFICER, // Set the role type as Officer
      Officer: {
        create: {
          managerId,
        }
      }
    },
  });
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ 
    where: { email }, 
  });
  if (!user) {
    throw new Error('User not found');
  }
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }
  const userData = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    designation: user.designation,
    profilePic: user.profilePic,
    role: user.roleType,
    token: generateToken(user.id, user.roleType)
  };

  return userData;
};
