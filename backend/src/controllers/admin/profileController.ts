// controllers/admin/profileController.ts
import { Request, Response } from 'express';

export const getAdminProfile = async (req: Request, res: Response) => {
  res.json(req.admin);
};
