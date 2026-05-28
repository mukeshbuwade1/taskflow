export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt?: string;
}

export interface AdminUserTaskStats {
  total: number;
  completed: number;
  pending: number;
}

export interface AdminUser extends User {
  taskStats: AdminUserTaskStats;
}

export interface AdminSystemStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalTasks: number;
  completedTasks: number;
}

export interface AdminUsersData {
  users: AdminUser[];
  systemStats: AdminSystemStats;
}

export type TaskStatus = 'pending' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  pagination?: PaginationMeta;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string | null;
}

export interface TaskQueryParams {
  status?: 'pending' | 'completed' | 'all';
  priority?: TaskPriority | 'all';
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  overdue?: boolean;
}

export interface StatusStat {
  count: number;
  percentage: number;
}

export interface DashboardData {
  totalTasks: number;
  statusStats: {
    completed: StatusStat;
    notStarted: StatusStat;
  };
  priorityStats: {
    high: StatusStat;
    medium: StatusStat;
    low: StatusStat;
  };
  todayTasks: Task[];
  highPriorityTasks: Task[];
  recentCompletedTasks: Task[];
  dueTasks: Task[];
}
