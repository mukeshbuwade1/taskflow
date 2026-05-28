import { useState, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask, toggleTask } from '../api/tasks.api';
import { Task, TaskFormData, PaginationMeta, TaskQueryParams } from '../types';
import toast from 'react-hot-toast';

interface UseTasksReturn {
  tasks: Task[];
  pagination: PaginationMeta;
  loading: boolean;
  fetchTasks: (params?: TaskQueryParams) => Promise<void>;
  addTask: (data: TaskFormData) => Promise<Task>;
  editTask: (id: string, data: Partial<TaskFormData>) => Promise<Task>;
  removeTask: (id: string) => Promise<void>;
  toggle: (id: string) => Promise<Task>;
}

const getApiErrorMessage = (err: unknown, fallback: string): string => {
  if (err && typeof err === 'object' && 'response' in err) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    return axiosErr.response?.data?.message ?? fallback;
  }
  return fallback;
};

const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async (params?: TaskQueryParams): Promise<void> => {
    setLoading(true);
    try {
      const { data } = await getTasks(params);
      setTasks(data.data);
      if (data.pagination) setPagination(data.pagination);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to load tasks'));
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (taskData: TaskFormData): Promise<Task> => {
    const { data } = await createTask(taskData);
    toast.success('Task created!');
    return data.data;
  }, []);

  const editTask = useCallback(async (id: string, taskData: Partial<TaskFormData>): Promise<Task> => {
    const { data } = await updateTask(id, taskData);
    toast.success('Task updated!');
    return data.data;
  }, []);

  const removeTask = useCallback(async (id: string): Promise<void> => {
    await deleteTask(id);
    toast.success('Task deleted!');
  }, []);

  const toggle = useCallback(async (id: string): Promise<Task> => {
    const { data } = await toggleTask(id);
    return data.data;
  }, []);

  return { tasks, pagination, loading, fetchTasks, addTask, editTask, removeTask, toggle };
};

export default useTasks;
