'use client';

import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  showPercentage?: boolean;
}

export default function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = 'violet',
  label,
  showPercentage = true,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const colorVariants: Record<string, { stroke: string; glow: string }> = {
    violet: {
      stroke: 'stroke-violet-500',
      glow: 'drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]',
    },
    green: {
      stroke: 'stroke-emerald-500',
      glow: 'drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]',
    },
    yellow: {
      stroke: 'stroke-amber-500',
      glow: 'drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]',
    },
    red: {
      stroke: 'stroke-red-500',
      glow: 'drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]',
    },
    blue: {
      stroke: 'stroke-blue-500',
      glow: 'drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]',
    },
  };

  const currentColor = colorVariants[color] || colorVariants.violet;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className={`transform -rotate-90 ${currentColor.glow}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-white/10"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={currentColor.stroke}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <motion.span
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            key={Math.round(progress)}
          >
            {Math.round(progress)}%
          </motion.span>
        )}
        {label && <span className="text-xs text-white/60 mt-1">{label}</span>}
      </div>
    </div>
  );
}
