import { useState, useEffect, useCallback } from "react";
import { HiExclamationCircle } from "react-icons/hi";
import toast from "react-hot-toast";
import TaskList from "../components/tasks/TaskList";
import TaskForm from "../components/tasks/TaskForm";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import Pagination from "../components/common/Pagination";
import useTasks from "../hooks/useTasks";
import { Task, TaskFormData, TaskStatus } from "../types";

type FilterValue = TaskStatus | "all";

const STATUS_TABS: { label: string; value: FilterValue }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

const getApiError = (err: unknown, fallback: string): string => {
  const e = err as { response?: { data?: { message?: string } } };
  return e.response?.data?.message ?? fallback;
};

const HighPriorityTasks = () => {
  const {
    tasks,
    pagination,
    loading,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
    toggle,
  } = useTasks();

  const [statusFilter, setStatusFilter] = useState<FilterValue>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(() => {
    fetchTasks({
      priority: "high",
      status: statusFilter === "all" ? undefined : statusFilter,
      page,
      limit,
    });
  }, [fetchTasks, statusFilter, page, limit]);

  useEffect(() => {
    load();
  }, [load]);

  const handleLimitChange = useCallback((val: number) => { setLimit(val); setPage(1); }, []);

  const openEdit   = useCallback((task: Task) => { setEditingTask(task); setModalOpen(true); }, []);
  const closeModal = useCallback(() => { setModalOpen(false); setEditingTask(null); }, []);

  const handleSubmit = useCallback(async (data: TaskFormData) => {
    setSubmitLoading(true);
    try {
      if (editingTask) {
        await editTask(editingTask._id, data);
      } else {
        await addTask({ ...data, priority: "high" });
      }
      closeModal();
      load();
    } catch (err) {
      toast.error(getApiError(err, "Something went wrong"));
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
      toast.error(getApiError(err, "Delete failed"));
    }
  }, [deleteId, removeTask, load]);

  const handleToggle = useCallback(async (id: string) => {
    try {
      await toggle(id);
      load();
    } catch {
      toast.error("Failed to update status");
    }
  }, [toggle, load]);

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <HiExclamationCircle className="text-primary-500" />
            High Priority
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {pagination.total} high-priority task
            {pagination.total !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-sidebar-light rounded-lg w-fit flex-wrap">
        {STATUS_TABS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => {
              setStatusFilter(value);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
              statusFilter === value
                ? "bg-white dark:bg-sidebar text-primary-600 dark:text-primary-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

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

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingTask ? "Edit Task" : "New High Priority Task"}
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={submitLoading}
        />
      </Modal>

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Task"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Are you sure you want to delete this task? This action cannot be
          undone.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default HighPriorityTasks;
