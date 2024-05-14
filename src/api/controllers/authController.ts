import { Request, Response } from 'express';
import { loginUser, registerManager, registerOfficer } from '../../services/authService';
import { getManagerIdByUserId } from '../../services/managerService';

export const viewRegisterManager = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      designation,
      dob,
      companyName,
      companyEmail,
      companyPhone,
      companyIndustry,
      companyAddress,
    } = req.body;
    let logo = null;
    let profilePic = null;
    
    if (req.files && typeof req.files === 'object') {
      if ('logo' in req.files && req.files.logo) {
        logo = `/uploads/${req.files.logo[0].filename}`;
      }
      if ('profilePic' in req.files && req.files.profilePic) {
        profilePic = `/uploads/${req.files.profilePic[0].filename}`;
      }
    }
    
    const user = await registerManager(
      fullName,
      email,
      phone,
      password,
      designation,
      dob,
      companyName,
      companyEmail,
      companyPhone,
      companyIndustry,
      companyAddress,
      profilePic,
      logo,
    );

    res.status(201).json({ message: 'Manager registered successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};



export const viewRegisterOfficer = async (req: Request, res: Response) => {
  try {
    const { email, phone, fullName, designation, password, dob } = req.body;

    let profilePic = null;

    if (req.files && typeof req.files === 'object') {
      if ('profilePic' in req.files && req.files.profilePic) {
        profilePic = `/uploads/${req.files.profilePic[0].filename}`;
      }
    }
    const userId = (req as any).user.userId
    const managerId = await getManagerIdByUserId(userId)

    const user = await registerOfficer( fullName, email, phone, password, designation, profilePic, managerId, dob);
    res.status(201).json({ message: 'Officer registered successfully', user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const viewLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    res.json(user);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};