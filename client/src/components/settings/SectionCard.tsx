import { memo, ElementType, ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  icon: ElementType;
  children: ReactNode;
}

const SectionCard = ({ title, icon: Icon, children }: SectionCardProps) => (
  <div className="card p-5 lg:p-6">
    <h2 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-5 pb-3 border-b border-gray-100 dark:border-sidebar-border">
      <Icon className="text-primary-500" size={18} />
      {title}
    </h2>
    {children}
  </div>
);

export default memo(SectionCard);
