type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  fullPage?: boolean;
  size?: SpinnerSize;
}

const sizes: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const Spinner = ({ fullPage = false, size = 'md' }: SpinnerProps) => {
  const spinner = (
    <div className={`${sizes[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`} />
  );
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 z-50">
        {spinner}
      </div>
    );
  }
  return <div className="flex justify-center py-8">{spinner}</div>;
};

export default Spinner;
