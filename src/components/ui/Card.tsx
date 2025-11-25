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
        relative rounded-2xl backdrop-blur-xl overflow-hidden
        ${gradient ? 'bg-gradient-to-br from-white/10 to-white/5' : 'bg-white/5'}
        ${hover ? 'cursor-pointer' : ''}
        ${selected ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-slate-900' : ''}
        ${glow ? 'shadow-2xl shadow-violet-500/10' : ''}
        ${className}
      `}
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glass border effect */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />

      {/* Gradient overlay */}
      {glow && (
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-purple-600/20 rounded-2xl blur-xl opacity-50" />
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
