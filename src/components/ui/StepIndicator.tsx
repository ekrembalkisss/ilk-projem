'use client';

import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export default function StepIndicator({
  steps,
  currentStep,
  className = '',
}: StepIndicatorProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between relative">
        {/* Connection line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10" />
        <motion.div
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500"
          initial={{ width: '0%' }}
          animate={{
            width: `${Math.min((currentStep / (steps.length - 1)) * 100, 100)}%`,
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div key={step.id} className="relative flex flex-col items-center z-10">
              <motion.div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  font-semibold text-sm transition-all duration-300
                  ${
                    isCompleted
                      ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white'
                      : isCurrent
                      ? 'bg-violet-500/20 border-2 border-violet-500 text-violet-400'
                      : 'bg-white/5 border-2 border-white/20 text-white/40'
                  }
                `}
                animate={
                  isCurrent
                    ? {
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          '0 0 0 0 rgba(139, 92, 246, 0)',
                          '0 0 0 10px rgba(139, 92, 246, 0.1)',
                          '0 0 0 0 rgba(139, 92, 246, 0)',
                        ],
                      }
                    : {}
                }
                transition={{
                  duration: 2,
                  repeat: isCurrent ? Infinity : 0,
                  ease: 'easeInOut',
                }}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  index + 1
                )}
              </motion.div>

              <div className="mt-3 text-center">
                <p
                  className={`text-sm font-medium ${
                    isCompleted || isCurrent ? 'text-white' : 'text-white/40'
                  }`}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-white/40 mt-0.5 max-w-[100px]">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
