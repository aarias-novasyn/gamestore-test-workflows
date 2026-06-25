import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-do-not-use-in-production';
export const SESSION_TIMEOUT_MINUTES = parseInt(process.env.SESSION_TIMEOUT_MINUTES || '60', 10);

export interface AuthRequest extends Request {
  userId?: number;
  userRole?: string;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    req.userId = decoded.userId;
    req.userRole = decoded.role;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { lastActivity: true }
    });

    if (user?.lastActivity) {
      const inactiveMs = Date.now() - new Date(user.lastActivity).getTime();
      const timeoutMs = SESSION_TIMEOUT_MINUTES * 60 * 1000;
      if (inactiveMs > timeoutMs) {
        return res.status(401).json({ error: 'Session expired due to inactivity' });
      }
    }

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { lastActivity: new Date() }
    });

    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const generateToken = (userId: number, role: string) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { userId: number };
};

export { JWT_SECRET };
