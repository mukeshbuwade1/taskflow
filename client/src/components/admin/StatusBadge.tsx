import { memo } from 'react';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';

interface StatusBadgeProps {
  isActive: boolean;
}

const StatusBadge = ({ isActive }: StatusBadgeProps) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
    isActive
      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
  }`}>
    {isActive ? <HiCheckCircle size={12} /> : <HiXCircle size={12} />}
    {isActive ? 'Active' : 'Inactive'}
  </span>
);

export default memo(StatusBadge);
