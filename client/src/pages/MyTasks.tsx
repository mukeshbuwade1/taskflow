import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiPlus, HiSearch } from 'react-icons/hi';
import toast from 'react-hot-toast';
import TaskList from '../components/tasks/TaskList';
import TaskFilter from '../components/tasks/TaskFilter';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Pagination from '../components/common/Pagination';
import useTasks from '../hooks/useTasks';
import { Task, TaskFormData, TaskStatus } from '../types';

type FilterValue = TaskStatus | 'all';

const getApiError = (err: unknown, fallback: string): string => {
  const e = err as { response?: { data?: { message?: string } } };
  return e.response?.data?.message ?? fallback;
};

const MyTasks = () => {
  const { tasks, pagination, loading, fetchTasks, addTask, editTask, removeTask, toggle } = useTasks();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filter, setFilter]       = useState<FilterValue>('all');
  const [search, setSearch]       = useState(() => searchParams.get('search') ?? '');
  const [page, setPage]           = useState(1);
  const [limit, setLimit]         = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask]   = useState<Task | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteId, setDeleteId]   = useState<string | null>(null);

  const load = useCallback(() => {
    fetchTasks({
      status: filter === 'all' ? undefined : filter,
      search: search || undefined,
      page,
      limit,
    });
  }, [fetchTasks, filter, search, page, limit]);

  useEffect(() => {
    if (searchParams.get('search')) {
      setSearchParams({}, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleFilterChange = useCallback((val: FilterValue) => { setFilter(val); setPage(1); }, []);
  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); setPage(1); }, []);
  const handleLimitChange = useCallback((val: number) => { setLimit(val); setPage(1); }, []);

  const openCreate = useCallback(() => { setEditingTask(null); setModalOpen(true); }, []);
  const openEdit   = useCallback((task: Task) => { setEditingTask(task); setModalOpen(true); }, []);
  const closeModal = useCallback(() => { setModalOpen(false); setEditingTask(null); }, []);

  const handleSubmit = useCallback(async (data: TaskFormData) => {
    setSubmitLoading(true);
    try {
      if (editingTask) {
        await editTask(editingTask._id, data);
      } else {
        await addTask(data);
      }
      closeModal();
      load();
    } catch (err) {
      toast.error(getApiError(err, 'Something went wrong'));
    } finally {
      setSubmitLoading(false);
    }
  }, [editingTask, editTask, addTask, closeModal, load]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {pagination.total} task{pagination.total !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button onClick={openCreate}>
          <HiPlus size={16} />
          New Task
        </Button>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <TaskFilter active={filter} onChange={handleFilterChange} />
        <div className="relative flex-1 sm:max-w-xs">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          <input
            type="text"
            placeholder="Search tasks…"
            value={search}
            onChange={handleSearch}
            className="input-field pl-9"
          />
        </div>
      </div>

      {/* Task list */}
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

      {/* Create / Edit modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editingTask ? 'Edit Task' : 'New Task'}>
        <TaskForm task={editingTask} onSubmit={handleSubmit} onCancel={closeModal} loading={submitLoading} />
      </Modal>

      {/* Delete confirm modal */}
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

export default MyTasks;
