import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  sublabel?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label, sublabel }) => {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className="w-full max-w-xl mx-auto my-6 space-y-2.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-800 dark:text-slate-200">
          {label || 'جارٍ المعالجة...'}
        </span>
        <span className="text-sm font-semibold tabular-nums text-blue-600 dark:text-blue-400">
          {clampedProgress}%
        </span>
      </div>

      <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700/50">
        <div
          className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-200 ease-out shadow-sm"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>

      {sublabel && (
        <p className="text-xs text-center text-slate-500 dark:text-slate-400">
          {sublabel}
        </p>
      )}
    </div>
  );
};
