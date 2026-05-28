import { memo } from 'react';
import { HiClipboardList } from 'react-icons/hi';
import { Task } from '../../types';
import TaskCard from './TaskCard';
import Spinner from '../common/Spinner';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const TaskList = ({ tasks, loading, onEdit, onDelete, onToggle }: TaskListProps) => {
  if (loading) return <Spinner />;
  if (!tasks.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
        <HiClipboardList size={48} className="mb-3 opacity-50" />
        <p className="text-sm font-medium">No tasks found</p>
        <p className="text-xs mt-1">Create a new task to get started</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
      ))}
    </div>
  );
};

export default memo(TaskList);
