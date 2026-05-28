import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/User.model';
import { sendSuccess, sendError } from '../utils/apiResponse';

const signToken = (id: string): string =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRE ?? '7d') as SignOptions['expiresIn'],
  });

const userPayload = (user: { _id: unknown; name: string; email: string; role: string; isActive: boolean }) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
});

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body as { name: string; email: string; password: string };
    const existing = await User.findOne({ email });
    if (existing) { sendError(res, 'Email already registered', 400); return; }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id.toString());
    sendSuccess(res, { token, user: userPayload(user) }, 'Registered successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    if (!user.isActive) {
      sendError(res, 'Your account has been deactivated. Contact an administrator.', 403);
      return;
    }
    const token = signToken(user._id.toString());
    sendSuccess(res, { token, user: userPayload(user) }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

export const getMe = (req: Request, res: Response): void => {
  const user = req.user!;
  sendSuccess(res, { ...userPayload(user), createdAt: user.createdAt }, 'User fetched');
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name } = req.body as { name: string };
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { name },
      { new: true, runValidators: true }
    );
    if (!user) { sendError(res, 'User not found', 404); return; }
    sendSuccess(res, userPayload(user), 'Profile updated');
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };
    const user = await User.findById(req.user!._id).select('+password');
    if (!user || !(await user.comparePassword(currentPassword))) {
      sendError(res, 'Current password is incorrect', 401);
      return;
    }
    user.password = newPassword;
    await user.save();
    sendSuccess(res, null, 'Password updated successfully');
  } catch (err) {
    next(err);
  }
};
