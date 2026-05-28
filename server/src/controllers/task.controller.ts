import { Request, Response, NextFunction } from 'express';
import Task, { TaskStatus, TaskPriority } from '../models/Task.model';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { TaskQueryParams } from '../types';

export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, priority, search, page = '1', limit = '10', sortBy = 'createdAt', order = 'desc', overdue } =
      req.query as TaskQueryParams;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = { user: req.user!._id };
    if (overdue === 'true') {
      filter.dueDate = { $lt: new Date(), $ne: null };
      filter.status = { $ne: 'completed' };
    } else {
      if (status && status !== 'all') filter.status = status as TaskStatus;
    }
    if (priority && priority !== 'all') filter.priority = priority as TaskPriority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = order === 'asc' ? 1 : -1;
    const allowedSort = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'title'];
    const sortField = allowedSort.includes(sortBy ?? '') ? (sortBy as string) : 'createdAt';

    const [tasks, total] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Task.find(filter).sort({ [sortField]: sortOrder } as any).skip(skip).limit(limitNum).lean(),
      Task.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);
    sendSuccess(res, tasks, 'Tasks fetched', 200, { total, page: pageNum, limit: limitNum, totalPages });
  } catch (err) { next(err); }
};

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, priority, dueDate } = req.body as {
      title: string; description?: string; priority?: string; dueDate?: string;
    };
    const task = await Task.create({ title, description, priority: priority as TaskPriority | undefined, dueDate, user: req.user!._id });
    sendSuccess(res, task, 'Task created', 201);
  } catch (err) { next(err); }
};

export const getTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user!._id });
    if (!task) { sendError(res, 'Task not found', 404); return; }
    sendSuccess(res, task, 'Task fetched');
  } catch (err) { next(err); }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, status, priority, dueDate } = req.body as {
      title?: string; description?: string; status?: string; priority?: string; dueDate?: string;
    };
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user!._id },
      { title, description, status: status as TaskStatus | undefined, priority: priority as TaskPriority | undefined, dueDate },
      { new: true, runValidators: true }
    );
    if (!task) { sendError(res, 'Task not found', 404); return; }
    sendSuccess(res, task, 'Task updated');
  } catch (err) { next(err); }
};

export const toggleTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user!._id });
    if (!task) { sendError(res, 'Task not found', 404); return; }
    const cycle: Record<TaskStatus, TaskStatus> = {
      'pending': 'completed',
      'completed': 'pending',
    };
    task.status = cycle[task.status];
    await task.save();
    sendSuccess(res, task, 'Task status updated');
  } catch (err) { next(err); }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user!._id });
    if (!task) { sendError(res, 'Task not found', 404); return; }
    sendSuccess(res, null, 'Task deleted');
  } catch (err) { next(err); }
};
