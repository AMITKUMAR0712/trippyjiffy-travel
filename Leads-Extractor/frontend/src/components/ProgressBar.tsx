interface ProgressBarProps {
  percent: number;
  label?: string;
  status?: string;
}

export default function ProgressBar({ percent, label, status }: ProgressBarProps) {
  const clampedPercent = Math.min(100, Math.max(0, percent));

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
          <span className="text-sm font-medium text-surface-900 dark:text-white">
            {label || 'Processing...'}
          </span>
        </div>
        <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-sm font-bold text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">
          {clampedPercent}%
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="relative h-full rounded-full bg-gradient-to-r from-brand-500 via-brand-400 to-indigo-400 transition-all duration-500 ease-out"
          style={{ width: `${clampedPercent}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer bg-[length:200%_100%]" />
        </div>
      </div>
      {status && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{status}</p>
      )}
    </div>
  );
}
