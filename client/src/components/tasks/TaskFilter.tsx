import { TaskStatus } from '../../types';

type FilterValue = TaskStatus | 'all';

const filters: { label: string; value: FilterValue }[] = [
  { label: 'All',       value: 'all' },
  { label: 'Pending',   value: 'pending' },
  { label: 'Completed', value: 'completed' },
];

interface TaskFilterProps {
  active: FilterValue;
  onChange: (value: FilterValue) => void;
}

const TaskFilter = ({ active, onChange }: TaskFilterProps) => (
  <div className="flex gap-1 p-1 bg-gray-100 dark:bg-sidebar-light rounded-lg w-fit flex-wrap">
    {filters.map(({ label, value }) => (
      <button
        key={value}
        onClick={() => onChange(value)}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
          active === value
            ? 'bg-white dark:bg-sidebar text-primary-600 dark:text-primary-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

export default TaskFilter;
