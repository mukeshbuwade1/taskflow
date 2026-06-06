import { useState, useEffect, useCallback } from 'react';
import {
  HiPlus,
  HiClipboardList,
  HiExclamationCircle,
  HiCheckCircle,
  HiClock,
} from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getDashboard } from '../api/dashboard.api';
import { toggleTask, createTask } from '../api/tasks.api';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import PieChart from '../components/dashboard/PieChart';
import TaskRow from '../components/dashboard/TaskRow';
import { useAuth } from '../context/AuthContext';
import { DashboardData, Task, TaskFormData } from '../types';

const emptyDashboard: DashboardData = {
  totalTasks: 0,
  statusStats: {
    completed:  { count: 0, percentage: 0 },
    notStarted: { count: 0, percentage: 0 },
  },
  priorityStats: {
    high:   { count: 0, percentage: 0 },
    medium: { count: 0, percentage: 0 },
    low:    { count: 0, percentage: 0 },
  },
  todayTasks: [],
  highPriorityTasks: [],
  recentCompletedTasks: [],
  dueTasks: [],
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const [data, setData] = useState<DashboardData>(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const todayLabel = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDashboard();
      setData(res.data.data);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleToggle = useCallback(async (id: string) => {
    const next: Record<string, string> = { pending: 'completed', completed: 'pending' };
    const flip = (t: Task): Task =>
      t._id === id ? { ...t, status: (next[t.status] ?? t.status) as Task['status'] } : t;
    setData(prev => ({
      ...prev,
      todayTasks:           prev.todayTasks.map(flip),
      highPriorityTasks:    prev.highPriorityTasks.map(flip),
      recentCompletedTasks: prev.recentCompletedTasks.map(flip),
      dueTasks:             prev.dueTasks.map(flip),
    }));
    try {
      await toggleTask(id);
      getDashboard().then(res => setData(res.data.data)).catch(() => {});
    } catch {
      toast.error('Failed to update status');
      getDashboard().then(res => setData(res.data.data)).catch(() => {});
    }
  }, []);

  const handleCreate = useCallback(async (form: TaskFormData) => {
    setCreating(true);
    try {
      await createTask(form);
      toast.success('Task created!');
      setAddOpen(false);
      navigate('/my-tasks');
    } catch {
      toast.error('Failed to create task');
    } finally {
      setCreating(false);
    }
  }, [navigate]);

  const { statusStats, priorityStats, todayTasks, highPriorityTasks, recentCompletedTasks, dueTasks } = data;

  const taskOverviewCard = (
    <div className="card p-4 lg:p-5">
      <h2 className="font-semibold text-primary-500 flex items-center gap-2 mb-5">
        <HiClipboardList size={16} />
        Task Overview
      </h2>
      <div className="flex flex-col gap-5 min-[400px]:flex-row min-[400px]:justify-around">
        <PieChart
          title="Status"
          slices={[
            { value: statusStats.completed.count,  color: '#22c55e', label: 'Completed' },
            { value: statusStats.notStarted.count, color: '#ef4444', label: 'Not Started' },
          ]}
        />
        <div className="hidden min-[400px]:block w-px bg-gray-100 dark:bg-gray-700 self-stretch" />
        <PieChart
          title="Priority"
          slices={[
            { value: priorityStats.high.count,   color: '#ef4444', label: 'High' },
            { value: priorityStats.medium.count, color: '#f59e0b', label: 'Medium' },
            { value: priorityStats.low.count,    color: '#22c55e', label: 'Low' },
          ]}
        />
      </div>
      <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
        {data.totalTasks} total task{data.totalTasks !== 1 ? 's' : ''}
      </p>
    </div>
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{todayLabel} · Today</p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="self-start flex-shrink-0">
          <HiPlus size={16} />
          Add Task
        </Button>
      </div>

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70 dark:bg-gray-950/70 backdrop-blur-[2px]">
            <Spinner />
          </div>
        )}
        <div className={`grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 transition-opacity duration-200 ${loading ? 'opacity-40 pointer-events-none' : ''}`}>
          {/* Mobile-only: Pie charts appear first */}
          <div className="lg:hidden">{taskOverviewCard}</div>

          {/* ── LEFT: Today's Tasks + Overdue ──────────────────── */}
          <div className="space-y-5">
            {/* Today's Tasks */}
            <div className="card p-4 lg:p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <HiClipboardList className="text-primary-500" size={18} />
                  Today's Tasks
                  {todayTasks.length > 0 && (
                    <span className="ml-1 text-xs text-gray-400">
                      ({todayTasks.length} due today)
                    </span>
                  )}
                </h2>
                <button
                  onClick={() => setAddOpen(true)}
                  className="text-xs font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1 transition"
                >
                  <HiPlus size={14} />
                  Add task
                </button>
              </div>

              {todayTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                  <HiCheckCircle size={40} className="mb-2 opacity-40" />
                  <p className="text-sm font-medium">All caught up!</p>
                  <p className="text-xs mt-1">No tasks due today.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayTasks.map((t) => (
                    <TaskRow key={t._id} task={t} onToggle={handleToggle} showStatus />
                  ))}
                </div>
              )}
            </div>

            {/* Overdue Tasks */}
            {dueTasks.length > 0 && (
              <div className="card p-4 lg:p-5 border-l-4 border-red-400">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-red-500 flex items-center gap-2">
                    <HiClock size={18} />
                    Overdue Tasks
                    <span className="ml-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                      {dueTasks.length}
                    </span>
                  </h2>
                  <Link
                    to="/overdue"
                    className="text-xs font-semibold text-primary-500 hover:text-primary-600 transition"
                  >
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {dueTasks.map((t) => (
                    <TaskRow key={t._id} task={t} onToggle={handleToggle} showStatus />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Stats + High priority ───────────────────── */}
          <div className="flex flex-col gap-5">
            {/* Pie charts (desktop only — shown above on mobile) */}
            <div className="hidden lg:block">{taskOverviewCard}</div>

            {/* High priority tasks */}
            {highPriorityTasks.length > 0 && (
              <div className="card p-4 lg:p-5">
                <h2 className="font-semibold text-primary-500 flex items-center gap-2 mb-4">
                  <HiExclamationCircle size={16} />
                  High Priority
                </h2>
                <div className="space-y-3">
                  {highPriorityTasks.map((t) => (
                    <TaskRow key={t._id} task={t} onToggle={handleToggle} />
                  ))}
                </div>
              </div>
            )}

            {/* Recently completed */}
            {recentCompletedTasks.length > 0 && (
              <div className="card p-4 lg:p-5">
                <h2 className="font-semibold text-primary-500 flex items-center gap-2 mb-4">
                  <HiCheckCircle size={16} />
                  Completed Task
                </h2>
                <div className="space-y-3">
                  {recentCompletedTasks.map((t) => (
                    <TaskRow key={t._id} task={t} onToggle={handleToggle} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Task modal */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="New Task">
        <TaskForm
          task={null}
          onSubmit={handleCreate}
          onCancel={() => setAddOpen(false)}
          loading={creating}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
