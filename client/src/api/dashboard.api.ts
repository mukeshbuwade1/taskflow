import api from './axios';
import { ApiResponse, DashboardData } from '../types';

export const getDashboard = () =>
  api.get<ApiResponse<DashboardData>>('/dashboard');
