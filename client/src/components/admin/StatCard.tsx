import { memo, ElementType } from 'react';

interface StatCardProps {
  label: string;
  value: number;
  icon: ElementType;
  color: string;
}

const StatCard = ({ label, value, icon: Icon, color }: StatCardProps) => (
  <div className="bg-white dark:bg-sidebar-light rounded-xl p-5 flex items-center gap-4 shadow-sm border border-gray-100 dark:border-sidebar-border">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    </div>
  </div>
);

export default memo(StatCard);
