import api from './axios';
import { ApiResponse, User } from '../types';

interface AuthResponseData {
  token: string;
  user: User;
}

export const registerUser = (data: { name: string; email: string; password: string }) =>
  api.post<ApiResponse<AuthResponseData>>('/auth/register', data);

export const loginUser = (data: { email: string; password: string }) =>
  api.post<ApiResponse<AuthResponseData>>('/auth/login', data);

export const getMe = () =>
  api.get<ApiResponse<User>>('/auth/me');

export const updateProfile = (data: { name: string }) =>
  api.put<ApiResponse<User>>('/auth/profile', data);

export const updatePassword = (data: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
  api.put<ApiResponse<null>>('/auth/password', data);
