import { memo } from 'react';
import { HiClock } from 'react-icons/hi';
import { Task } from '../../types';

const STATUS_CONFIG = {
  pending:   { color: '#ef4444', label: 'Pending',   ring: 'border-red-400' },
  completed: { color: '#22c55e', label: 'Completed', ring: 'border-green-400' },
} as const;

const PRIORITY_STYLES = {
  low:    'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high:   'bg-red-100 text-red-700',
} as const;

const formatDueDate = (d: string | null): string | null => {
  if (!d) return null;
  const dt = new Date(d);
  const dateLabel = dt.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const hasTime = !(d.endsWith('T00:00:00.000Z') || d.length === 10);
  if (hasTime) return `${dateLabel} ${dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  return dateLabel;
};

interface TaskRowProps {
  task: Task;
  onToggle: (id: string) => void;
  showStatus?: boolean;
}

const TaskRow = ({ task, onToggle, showStatus = false }: TaskRowProps) => {
  const cfg = STATUS_CONFIG[task.status];
  const isCompleted = task.status === 'completed';

  return (
    <div className="rounded-xl border border-gray-100 dark:border-sidebar-border bg-white dark:bg-sidebar-light p-3 flex gap-3 hover:shadow-card-md transition-shadow">
      <button
        onClick={() => onToggle(task._id)}
        title={`Status: ${cfg.label}. Click to advance`}
        className={[
          'mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors hover:opacity-70',
          isCompleted ? 'bg-green-400 border-green-400' : `border-2 ${cfg.ring}`,
        ].join(' ')}
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold leading-snug ${
            isCompleted ? 'line-through text-gray-400' : 'text-gray-800 dark:text-white'
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
            {task.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
              PRIORITY_STYLES[task.priority]
            }`}
          >
            {task.priority}
          </span>
          {showStatus && (
            <span className="text-xs font-medium" style={{ color: cfg.color }}>
              {cfg.label}
            </span>
          )}
          {task.dueDate && (
            <span className="text-xs text-gray-400 ml-auto flex items-center gap-1">
              <HiClock size={11} />
              Due: {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(TaskRow);
