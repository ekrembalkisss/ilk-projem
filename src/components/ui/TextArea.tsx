'use client';

import { motion } from 'framer-motion';
import { forwardRef } from 'react';

interface TextAreaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  error?: string;
  disabled?: boolean;
  className?: string;
  maxLength?: number;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    label,
    placeholder,
    value,
    onChange,
    rows = 6,
    error,
    disabled = false,
    className = '',
    maxLength,
  },
  ref
) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-white/80">{label}</label>
          {maxLength && (
            <span className="text-xs text-white/40">
              {value.length.toLocaleString()} / {maxLength.toLocaleString()}
            </span>
          )}
        </div>
      )}
      <motion.textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        maxLength={maxLength}
        className={`
          w-full px-4 py-3 rounded-xl
          bg-white/5 backdrop-blur-sm
          border border-white/10
          text-white placeholder-white/30
          focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          resize-none
          ${error ? 'border-red-500/50 ring-2 ring-red-500/30' : ''}
        `}
        whileFocus={{ scale: 1.005 }}
      />
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

export default TextArea;
