import { Request, Response, NextFunction } from 'express';
import Task from '../models/Task.model';
import { sendSuccess } from '../utils/apiResponse';

export const getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!._id;

    const now = new Date();
    const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
    const endOfDay   = new Date(now); endOfDay.setHours(23, 59, 59, 999);

    const [statusGroups, priorityGroups, todayTasks, highPriorityTasks, recentCompletedTasks, dueTasks] = await Promise.all([
      Task.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Task.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
      Task.find({
        user: userId,
        status: 'pending',
        dueDate: { $gte: startOfDay, $lte: endOfDay },
      }).sort({ dueDate: 1 }).limit(5).lean(),
      Task.find({ user: userId, priority: 'high', status: { $ne: 'completed' } })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Task.find({ user: userId, status: 'completed' })
        .sort({ updatedAt: -1 })
        .limit(3)
        .lean(),
      Task.find({ user: userId, status: { $ne: 'completed' }, dueDate: { $lt: now, $ne: null } })
        .sort({ dueDate: 1 })
        .limit(5)
        .lean(),
    ]);

    const counts = { completed: 0, pending: 0 };
    for (const g of statusGroups) {
      if (g._id in counts) counts[g._id as keyof typeof counts] = g.count as number;
    }
    const total = counts.completed + counts.pending;
    const toPercent = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

    const priorityCounts = { high: 0, medium: 0, low: 0 };
    for (const g of priorityGroups) {
      if (g._id in priorityCounts) priorityCounts[g._id as keyof typeof priorityCounts] = g.count as number;
    }
    const totalPriority = priorityCounts.high + priorityCounts.medium + priorityCounts.low;
    const toPriorityPercent = (n: number) => (totalPriority > 0 ? Math.round((n / totalPriority) * 100) : 0);

    sendSuccess(res, {
      totalTasks: total,
      statusStats: {
        completed:  { count: counts.completed, percentage: toPercent(counts.completed) },
        notStarted: { count: counts.pending,   percentage: toPercent(counts.pending) },
      },
      priorityStats: {
        high:   { count: priorityCounts.high,   percentage: toPriorityPercent(priorityCounts.high) },
        medium: { count: priorityCounts.medium, percentage: toPriorityPercent(priorityCounts.medium) },
        low:    { count: priorityCounts.low,    percentage: toPriorityPercent(priorityCounts.low) },
      },
      todayTasks,
      highPriorityTasks,
      recentCompletedTasks,
      dueTasks,
    }, 'Dashboard data fetched');
  } catch (err) { next(err); }
};
