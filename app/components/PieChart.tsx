'use client';

import { CategoryBreakdown } from '../types';

interface PieChartProps {
  data: CategoryBreakdown[];
  type: 'income' | 'expense';
}

export default function PieChart({ data, type }: PieChartProps) {
  const size = 300;
  const center = size / 2;
  const radius = size / 2 - 20;

  if (data.length === 0) {
    return null;
  }

  let currentAngle = -90; // Start from top
  const paths: Array<{ path: string; color: string; category: string }> = [];

  data.forEach((item, index) => {
    const sliceAngle = (item.percentage / 100) * 360;
    const endAngle = currentAngle + sliceAngle;

    // Convert to radians
    const startRad = (currentAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Calculate path coordinates
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    // Large arc flag
    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    // Create path
    const pathD = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    paths.push({
      path: pathD,
      color: getColor(index, type),
      category: item.category,
    });

    currentAngle = endAngle;
  });

  return (
    <div className="relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {paths.map((item, index) => (
          <g key={index}>
            <path
              d={item.path}
              fill={item.color}
              className="transition-opacity hover:opacity-80 cursor-pointer"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

function getColor(index: number, type: 'income' | 'expense'): string {
  const expenseColors = [
    '#ef4444', // red-500
    '#f97316', // orange-500
    '#f59e0b', // amber-500
    '#eab308', // yellow-500
    '#84cc16', // lime-500
    '#22c55e', // green-500
    '#10b981', // emerald-500
    '#14b8a6', // teal-500
  ];

  const incomeColors = [
    '#22c55e', // green-500
    '#10b981', // emerald-500
    '#14b8a6', // teal-500
    '#06b6d4', // cyan-500
  ];

  const colors = type === 'expense' ? expenseColors : incomeColors;
  return colors[index % colors.length];
}
