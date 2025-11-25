'use client';

import { motion } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'url';
  icon?: ReactNode;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    placeholder,
    value,
    onChange,
    type = 'text',
    icon,
    error,
    disabled = false,
    className = '',
  },
  ref
) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white/80 mb-2">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">{icon}</div>
        )}
        <motion.input
          ref={ref}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-xl
            bg-white/5 backdrop-blur-sm
            border border-white/10
            text-white placeholder-white/30
            focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-12' : ''}
            ${error ? 'border-red-500/50 ring-2 ring-red-500/30' : ''}
          `}
          whileFocus={{ scale: 1.01 }}
        />
      </div>
      {error && (
        <motion.p
          className="mt-2 text-sm text-red-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

export default Input;
