import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import User from '../models/User.model';
import Task from '../models/Task.model';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page  = Math.max(1, Number(req.query.page)  || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const search = (req.query.search as string | undefined)?.trim();

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    // Per-user task stats via aggregation
    const userIds = users.map((u) => u._id as Types.ObjectId);
    const taskStats = await Task.aggregate<{
      _id: Types.ObjectId;
      total: number;
      completed: number;
      pending: number;
    }>([
      { $match: { user: { $in: userIds } } },
      {
        $group: {
          _id: '$user',
          total:     { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          pending:   { $sum: { $cond: [{ $eq: ['$status', 'pending']   }, 1, 0] } },
        },
      },
    ]);

    const statsMap = new Map(taskStats.map((s) => [s._id.toString(), s]));

    const enrichedUsers = users.map((u) => ({
      ...u.toObject(),
      taskStats: statsMap.get(u._id.toString()) ?? { total: 0, completed: 0, pending: 0 },
    }));

    // System-wide stats for the summary cards
    const [totalTasks, completedTasks, activeUsers, inactiveUsers] = await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ status: 'completed' }),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
    ]);

    sendSuccess(
      res,
      {
        users: enrichedUsers,
        systemStats: { totalUsers: total, activeUsers, inactiveUsers, totalTasks, completedTasks },
      },
      'Users fetched',
      200,
      { total, page, limit, totalPages: Math.ceil(total / limit) }
    );
  } catch (err) {
    next(err);
  }
};

export const toggleUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (id === req.user!._id.toString()) {
      sendError(res, 'You cannot deactivate your own account', 400);
      return;
    }

    const target = await User.findById(id);
    if (!target) { sendError(res, 'User not found', 404); return; }
    if (target.role === 'admin') { sendError(res, 'Cannot change status of an admin account', 400); return; }

    target.isActive = !target.isActive;
    await target.save();

    sendSuccess(
      res,
      { _id: target._id, isActive: target.isActive },
      `User ${target.isActive ? 'activated' : 'deactivated'} successfully`
    );
  } catch (err) {
    next(err);
  }
};

export const adminUpdatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body as { newPassword: string };

    const target = await User.findById(id).select('+password');
    if (!target) { sendError(res, 'User not found', 404); return; }

    target.password = newPassword;
    await target.save();

    sendSuccess(res, null, 'Password updated successfully');
  } catch (err) {
    next(err);
  }
};
