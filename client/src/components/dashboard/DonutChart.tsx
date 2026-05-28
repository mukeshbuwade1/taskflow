interface DonutChartProps {
  percentage: number;
  color: string;
  trackColor?: string;
  label: string;
  size?: number;
}

const DonutChart = ({
  percentage,
  color,
  trackColor = '#e5e7eb',
  label,
  size = 90,
}: DonutChartProps) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percentage));
  const dash = (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 100 100"
          style={{ width: size, height: size }}
          className="-rotate-90"
        >
          {/* Track ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth="11"
          />
          {/* Progress ring */}
          {clamped > 0 && (
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
            />
          )}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-bold" style={{ color }}>
            {clamped}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</span>
      </div>
    </div>
  );
};

export default DonutChart;
