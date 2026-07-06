interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div
          className={`${sizes[size]} rounded-full border-[3px] border-brand-100 dark:border-brand-900`}
        />
        <div
          className={`absolute inset-0 ${sizes[size]} animate-spin rounded-full border-[3px] border-transparent border-t-brand-600`}
        />
      </div>
      {text && (
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{text}</p>
      )}
    </div>
  );
}
