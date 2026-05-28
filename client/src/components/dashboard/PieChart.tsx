interface PieSlice {
  value: number;
  color: string;
  label: string;
}

interface PieChartProps {
  title: string;
  slices: PieSlice[];
  size?: number;
}

const PieChart = ({ title, slices, size = 130 }: PieChartProps) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 6;
  const total = slices.reduce((sum, s) => sum + s.value, 0);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center gap-3">
        <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-300">{title}</h3>
        <svg width={size} height={size}>
          <circle cx={cx} cy={cy} r={r} fill="#e5e7eb" className="dark:fill-gray-700" />
          <text x={cx} y={cy + 4} textAnchor="middle" className="text-xs fill-gray-400" fontSize={11}>
            No data
          </text>
        </svg>
        <div className="w-full" />
      </div>
    );
  }

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  let currentAngle = -90;

  const paths = slices.map((slice) => {
    const angle = (slice.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const largeArc = angle > 180 ? 1 : 0;

    const d =
      angle >= 360
        ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r} Z`
        : `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return {
      d,
      color: slice.color,
      label: slice.label,
      value: slice.value,
      percentage: Math.round((slice.value / total) * 100),
    };
  });

  return (
    <div className="flex flex-col items-center gap-3 flex-1">
      <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-300">{title}</h3>
      <svg width={size} height={size} className="drop-shadow-sm">
        {paths.map((p, i) => (
          <path key={i} d={p.d} fill={p.color} stroke="white" strokeWidth={2} />
        ))}
      </svg>
      <div className="flex flex-col gap-1.5 w-full">
        {paths.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-gray-600 dark:text-gray-400 flex-1 truncate">{p.label}</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300 tabular-nums">
              {p.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;
