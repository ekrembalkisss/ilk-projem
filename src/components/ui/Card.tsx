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
        relative rounded-[20px] overflow-hidden
        ${gradient
          ? 'bg-gradient-to-br from-[rgba(20,20,30,0.9)] to-[rgba(10,10,15,0.95)]'
          : 'bg-[rgba(15,15,20,0.8)] backdrop-blur-[20px]'}
        border border-white/[0.08]
        ${hover ? 'cursor-pointer' : ''}
        ${selected ? 'ring-2 ring-violet-500/50 border-violet-500/30' : ''}
        ${glow ? 'shadow-[0_4px_24px_rgba(0,0,0,0.4),0_0_60px_rgba(139,92,246,0.15)]' : 'shadow-[0_4px_24px_rgba(0,0,0,0.4)]'}
        transition-all duration-300
        ${className}
      `}
      whileHover={hover ? {
        scale: 1.01,
        y: -2,
        boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 60px rgba(139,92,246,0.2)',
        borderColor: 'rgba(139,92,246,0.25)'
      } : {}}
      whileTap={onClick ? { scale: 0.99 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Inner glow border */}
      <div className="absolute inset-0 rounded-[20px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] pointer-events-none" />

      {/* Gradient glow effect */}
      {glow && (
        <div className="absolute -inset-[1px] bg-gradient-to-br from-violet-500/30 via-transparent to-indigo-500/30 rounded-[21px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
