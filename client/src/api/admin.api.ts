import api from './axios';
import { ApiResponse, AdminUsersData, PaginationMeta } from '../types';

interface AdminUsersParams {
  search?: string;
  page?: number;
  limit?: number;
}

interface AdminUsersResponse extends ApiResponse<AdminUsersData> {
  pagination: PaginationMeta;
}

export const getAdminUsers = (params?: AdminUsersParams) =>
  api.get<AdminUsersResponse>('/admin/users', { params });

export const toggleUserStatus = (id: string) =>
  api.patch<ApiResponse<{ _id: string; isActive: boolean }>>(`/admin/users/${id}/status`);

export const adminUpdatePassword = (id: string, newPassword: string, confirmPassword: string) =>
  api.put<ApiResponse<null>>(`/admin/users/${id}/password`, { newPassword, confirmPassword });
