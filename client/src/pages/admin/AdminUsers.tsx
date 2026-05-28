import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import {
  HiSearch, HiUsers, HiCheckCircle, HiXCircle,
  HiClipboardList, HiLockClosed, HiRefresh,
} from 'react-icons/hi';
import { getAdminUsers, toggleUserStatus, adminUpdatePassword } from '../../api/admin.api';
import { AdminUser, AdminSystemStats, PaginationMeta } from '../../types';
import Pagination from '../../components/common/Pagination';
import Spinner from '../../components/common/Spinner';
import PasswordModal from '../../components/admin/PasswordModal';
import StatCard from '../../components/admin/StatCard';
import RoleBadge from '../../components/admin/RoleBadge';
import StatusBadge from '../../components/admin/StatusBadge';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_STATS: AdminSystemStats = {
  totalUsers: 0, activeUsers: 0, inactiveUsers: 0, totalTasks: 0, completedTasks: 0,
};

const DEFAULT_PAGE: PaginationMeta = { total: 0, page: 1, limit: 10, totalPages: 1 };

const getApiError = (err: unknown, fallback: string) => {
  const e = err as { response?: { data?: { message?: string } } };
  return e.response?.data?.message ?? fallback;
};


const AdminUsers = () => {
  const { user: me } = useAuth();

  const [users, setUsers]         = useState<AdminUser[]>([]);
  const [stats, setStats]         = useState<AdminSystemStats>(DEFAULT_STATS);
  const [pagination, setPagination] = useState<PaginationMeta>(DEFAULT_PAGE);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [limit, setLimit]         = useState(10);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [pwdTarget, setPwdTarget] = useState<AdminUser | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers({ search: search || undefined, page, limit });
      setUsers(res.data.data.users);
      setStats(res.data.data.systemStats);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error(getApiError(err, 'Failed to load users'));
    } finally {
      setLoading(false);
    }
  }, [search, page, limit]);

  useEffect(() => { load(); }, [load]);

  const handleToggle = useCallback(async (u: AdminUser) => {
    setTogglingId(u._id);
    try {
      await toggleUserStatus(u._id);
      toast.success(`${u.name} ${u.isActive ? 'deactivated' : 'activated'}`);
      load();
    } catch (err) {
      toast.error(getApiError(err, 'Failed to update status'));
    } finally {
      setTogglingId(null);
    }
  }, [load]);

  const handlePasswordSave = useCallback(async (id: string, pwd: string, confirm: string) => {
    await adminUpdatePassword(id, pwd, confirm);
    toast.success('Password updated successfully');
  }, []);

  const completionRate = stats.totalTasks
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Manage all registered users and monitor system activity
        </p>
      </div>

      {/* System stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users"    value={stats.totalUsers}    icon={HiUsers}         color="bg-primary-500" />
        <StatCard label="Active Users"   value={stats.activeUsers}   icon={HiCheckCircle}   color="bg-green-500" />
        <StatCard label="Inactive Users" value={stats.inactiveUsers} icon={HiXCircle}       color="bg-red-500" />
        <StatCard label="Total Tasks"    value={stats.totalTasks}    icon={HiClipboardList} color="bg-yellow-500" />
      </div>

      {/* Completion banner */}
      {stats.totalTasks > 0 && (
        <div className="bg-white dark:bg-sidebar-light rounded-xl p-4 shadow-sm border border-gray-100 dark:border-sidebar-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              System-wide task completion
            </span>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
              {completionRate}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
            {stats.completedTasks} of {stats.totalTasks} tasks completed across all users
          </p>
        </div>
      )}

      {/* Search + refresh */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-9"
          />
        </div>
        <button
          onClick={load}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-sidebar-light dark:text-gray-400 dark:hover:text-gray-200 transition"
          title="Refresh"
        >
          <HiRefresh size={18} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-sidebar-light rounded-xl shadow-sm border border-gray-100 dark:border-sidebar-border overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            No users found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-sidebar-border bg-gray-50 dark:bg-sidebar">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">User</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Role</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Tasks</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Joined</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-sidebar-border">
                {users.map((u) => {
                  const initials = u.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
                  const isSelf   = u._id === me?._id;
                  const toggling = togglingId === u._id;

                  return (
                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-sidebar transition-colors">
                      {/* User */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                            u.isActive ? 'bg-primary-500' : 'bg-gray-400'
                          }`}>
                            {initials}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                              {u.name}
                              {isSelf && (
                                <span className="text-xs text-primary-500 font-normal">(you)</span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3">
                        <RoleBadge role={u.role} />
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge isActive={u.isActive} />
                      </td>

                      {/* Task stats */}
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex items-center gap-2 text-xs">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {u.taskStats.total} total
                          </span>
                          <span className="text-green-600 dark:text-green-400">
                            {u.taskStats.completed} done
                          </span>
                          <span className="text-yellow-600 dark:text-yellow-400">
                            {u.taskStats.pending} pending
                          </span>
                        </div>
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                          : '—'}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          {/* Toggle status — disabled for self and other admins */}
                          {!isSelf && u.role !== 'admin' && (
                            <button
                              onClick={() => handleToggle(u)}
                              disabled={toggling}
                              title={u.isActive ? 'Deactivate user' : 'Activate user'}
                              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50 ${
                                u.isActive
                                  ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40'
                                  : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40'
                              }`}
                            >
                              {toggling ? (
                                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : u.isActive ? (
                                <HiXCircle size={14} />
                              ) : (
                                <HiCheckCircle size={14} />
                              )}
                              {u.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          )}

                          {/* Update password */}
                          <button
                            onClick={() => setPwdTarget(u)}
                            title="Update password"
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-sidebar dark:text-gray-400 dark:hover:bg-sidebar-border transition"
                          >
                            <HiLockClosed size={13} />
                            Password
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination
        page={page}
        totalPages={pagination.totalPages}
        onChange={setPage}
        total={pagination.total}
        limit={limit}
        onLimitChange={(val) => { setLimit(val); setPage(1); }}
      />

      <PasswordModal
        user={pwdTarget}
        onClose={() => setPwdTarget(null)}
        onSave={handlePasswordSave}
      />
    </div>
  );
};

export default AdminUsers;
