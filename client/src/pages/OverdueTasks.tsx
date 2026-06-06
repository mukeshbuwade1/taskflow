import { useState, useEffect, useCallback } from 'react';
import { HiClock } from 'react-icons/hi';
import toast from 'react-hot-toast';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Pagination from '../components/common/Pagination';
import useTasks from '../hooks/useTasks';
import { Task, TaskFormData } from '../types';

const getApiError = (err: unknown, fallback: string): string => {
  const e = err as { response?: { data?: { message?: string } } };
  return e.response?.data?.message ?? fallback;
};

const OverdueTasks = () => {
  const { tasks, pagination, loading, fetchTasks, editTask, removeTask, toggle } = useTasks();

  const [page, setPage]   = useState(1);
  const [limit, setLimit] = useState(10);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(() => {
    fetchTasks({ overdue: true, page, limit, sortBy: 'dueDate', order: 'asc' });
  }, [fetchTasks, page, limit]);

  useEffect(() => { load(); }, [load]);

  const handleLimitChange = useCallback((val: number) => { setLimit(val); setPage(1); }, []);

  const openEdit   = useCallback((task: Task) => { setEditingTask(task); setModalOpen(true); }, []);
  const closeModal = useCallback(() => { setModalOpen(false); setEditingTask(null); }, []);

  const handleSubmit = useCallback(async (data: TaskFormData) => {
    if (!editingTask) return;
    setSubmitLoading(true);
    try {
      await editTask(editingTask._id, data);
      closeModal();
      load();
    } catch (err) {
      toast.error(getApiError(err, 'Something went wrong'));
    } finally {
      setSubmitLoading(false);
    }
  }, [editingTask, editTask, closeModal, load]);

  const confirmDelete = useCallback(async () => {
    if (!deleteId) return;
    try {
      await removeTask(deleteId);
      setDeleteId(null);
      load();
    } catch (err) {
      toast.error(getApiError(err, 'Delete failed'));
    }
  }, [deleteId, removeTask, load]);

  const handleToggle = useCallback(async (id: string) => {
    try {
      await toggle(id);
      load();
    } catch {
      toast.error('Failed to update status');
    }
  }, [toggle, load]);

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <HiClock className="text-red-500" />
          Overdue Tasks
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {pagination.total} overdue task{pagination.total !== 1 ? 's' : ''} — past their due date and not yet completed
        </p>
      </div>

      {/* Banner when no overdue tasks */}
      {!loading && tasks.length === 0 && (
        <div className="card p-8 flex flex-col items-center justify-center text-center gap-2">
          <HiClock size={40} className="text-green-400 opacity-60" />
          <p className="font-semibold text-gray-700 dark:text-gray-200">No overdue tasks!</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">You're all caught up — every task is on schedule.</p>
        </div>
      )}

      <TaskList
        tasks={tasks}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteId}
        onToggle={handleToggle}
      />

      <Pagination
        page={page}
        totalPages={pagination.totalPages}
        onChange={setPage}
        total={pagination.total}
        limit={limit}
        onLimitChange={handleLimitChange}
      />

      <Modal isOpen={modalOpen} onClose={closeModal} title="Edit Task">
        <TaskForm task={editingTask} onSubmit={handleSubmit} onCancel={closeModal} loading={submitLoading} />
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Task">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Are you sure you want to delete this task? This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default OverdueTasks;
