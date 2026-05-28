import api from './axios';
import { ApiResponse, Task, TaskFormData, TaskQueryParams } from '../types';

export const getTasks = (params?: TaskQueryParams) =>
  api.get<ApiResponse<Task[]>>('/tasks', { params });

export const createTask = (data: TaskFormData) =>
  api.post<ApiResponse<Task>>('/tasks', data);

export const getTask = (id: string) =>
  api.get<ApiResponse<Task>>(`/tasks/${id}`);

export const updateTask = (id: string, data: Partial<TaskFormData> & { status?: string }) =>
  api.put<ApiResponse<Task>>(`/tasks/${id}`, data);

export const toggleTask = (id: string) =>
  api.patch<ApiResponse<Task>>(`/tasks/${id}/toggle`);

export const deleteTask = (id: string) =>
  api.delete<ApiResponse<null>>(`/tasks/${id}`);
