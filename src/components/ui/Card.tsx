'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export default function Card({
  children,
  className = '',
  hover = false,
  glow = false,
  gradient = false,
  onClick,
  selected = false,
}: CardProps) {
  return (
    <motion.div
      onClick={onClick}
      className={`
        relative rounded-2xl overflow-hidden
        ${gradient
          ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/95'
          : 'bg-slate-800/80'}
        ${hover ? 'cursor-pointer hover:bg-slate-700/80' : ''}
        ${selected ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-slate-900' : ''}
        ${glow ? 'shadow-2xl shadow-violet-500/20' : 'shadow-xl shadow-black/20'}
        ${className}
      `}
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Border effect */}
      <div className="absolute inset-0 rounded-2xl border border-violet-500/20 pointer-events-none" />

      {/* Gradient overlay for glow */}
      {glow && (
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/30 via-indigo-600/30 to-purple-600/30 rounded-2xl blur-xl opacity-60" />
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
