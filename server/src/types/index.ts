export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TaskQueryParams {
  status?: 'pending' | 'completed' | 'all';
  priority?: 'low' | 'medium' | 'high' | 'all';
  search?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  overdue?: string;
}
