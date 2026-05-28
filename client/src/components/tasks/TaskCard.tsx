import { memo, useState, useRef, useEffect } from 'react';
import { HiDotsVertical, HiPencil, HiTrash, HiCalendar } from 'react-icons/hi';
import { Task, TaskPriority, TaskStatus } from '../../types';

const priorityStyles: Record<TaskPriority, string> = {
  low:    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  high:   'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

const statusConfig: Record<TaskStatus, { color: string; label: string; ringClass: string }> = {
  pending:   { color: '#ef4444', label: 'Pending',   ringClass: 'border-red-400' },
  completed: { color: '#22c55e', label: 'Completed', ringClass: 'border-green-400' },
};

const formatDate = (dateStr: string | null): string | null => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const hasTime = !(dateStr.endsWith('T00:00:00.000Z') || dateStr.length === 10);
  if (hasTime) {
    return `${dateLabel}, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return dateLabel;
};

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const TaskCard = ({ task, onEdit, onDelete, onToggle }: TaskCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isCompleted = task.status === 'completed';
  const cfg = statusConfig[task.status];

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  return (
    <div className={`card p-4 flex gap-3 transition hover:shadow-card-md ${isCompleted ? 'opacity-70' : ''}`}>
      {/* Status circle */}
      <button
        onClick={() => onToggle(task._id)}
        title={`${cfg.label} — click to toggle`}
        className={[
          'mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors hover:opacity-70',
          isCompleted ? 'bg-green-400 border-green-400' : cfg.ringClass,
        ].join(' ')}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`font-medium text-sm leading-snug break-words ${
              isCompleted ? 'line-through text-gray-400' : ''
            }`}
          >
            {task.title}
          </h3>

          {/* Three-dot menu */}
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title="Options"
            >
              <HiDotsVertical size={16} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-8 z-20 w-36 bg-white dark:bg-sidebar rounded-xl shadow-lg border border-gray-100 dark:border-sidebar-border overflow-hidden">
                <button
                  onClick={() => { onEdit(task); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-sidebar-light transition"
                >
                  <HiPencil size={14} className="text-blue-500" />
                  Edit
                </button>
                <div className="h-px bg-gray-100 dark:bg-sidebar-border mx-2" />
                <button
                  onClick={() => { onDelete(task._id); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  <HiTrash size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${priorityStyles[task.priority]}`}>
            {task.priority}
          </span>
          <span className="text-xs font-medium" style={{ color: cfg.color }}>
            {cfg.label}
          </span>
          {task.dueDate && (
            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <HiCalendar size={12} />
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(TaskCard);
