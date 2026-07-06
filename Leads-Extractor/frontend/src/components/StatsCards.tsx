import type { Analytics } from '../types';

interface StatsCardsProps {
  analytics: Analytics | null;
  resultCount?: number;
}

const stats: {
  key: string;
  label: string;
  getValue: (a: Analytics | null, r?: number) => string | number;
  gradient: string;
  icon: string;
}[] = [
  {
    key: 'current',
    label: 'Current Results',
    getValue: (_a, r = 0) => r,
    gradient: 'from-brand-500 to-indigo-600',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  },
  {
    key: 'total',
    label: 'Total Companies',
    getValue: (a: Analytics | null) => a?.totalCompanies ?? 0,
    gradient: 'from-violet-500 to-purple-600',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  {
    key: 'emails',
    label: 'Emails Found',
    getValue: (a: Analytics | null) => a?.emailsFound ?? 0,
    gradient: 'from-emerald-500 to-teal-600',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    key: 'rate',
    label: 'Email Rate',
    getValue: (a: Analytics | null) => `${a?.emailRate ?? 0}%`,
    gradient: 'from-amber-500 to-orange-600',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    key: 'searches',
    label: 'Total Searches',
    getValue: (a: Analytics | null) => a?.totalSearches ?? 0,
    gradient: 'from-rose-500 to-pink-600',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  },
];

export default function StatsCards({ analytics, resultCount = 0 }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {stats.map((stat) => (
        <div key={stat.key} className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
                {stat.getValue(analytics, resultCount)}
              </p>
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
