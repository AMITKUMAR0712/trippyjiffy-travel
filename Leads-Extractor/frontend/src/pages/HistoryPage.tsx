import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { searchApi, downloadBlob } from '../services/api';
import type { SearchHistory } from '../types';

export default function HistoryPage() {
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const { data } = await searchApi.getHistory({ page: 1, limit: 50 });
      setHistory(data.data.history);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (item: SearchHistory, format: 'csv' | 'excel') => {
    try {
      const params = { searchHistoryId: item.id };
      if (format === 'csv') {
        const { data } = await searchApi.exportCsv(params);
        downloadBlob(data, `search-${item.city}-${item.country}.csv`);
      } else {
        const { data } = await searchApi.exportExcel(params);
        downloadBlob(data, `search-${item.city}-${item.country}.xlsx`);
      }
      toast.success(`${format.toUpperCase()} downloaded`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Download failed');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading search history..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="badge-brand mb-3">Archive</span>
        <h1 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-white">
          Search History
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          View and download results from your past searches
        </p>
      </div>

      {history.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
            <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="font-medium text-slate-600 dark:text-slate-300">No searches yet</p>
          <p className="mt-1 text-sm text-slate-400">Your search history will appear here</p>
          <Link to="/" className="btn-primary mt-6">
            Start Searching
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="card flex flex-col gap-4 transition-all hover:shadow-card sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-indigo-100 dark:from-brand-900/40 dark:to-indigo-900/40">
                  <svg className="h-5 w-5 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-surface-900 dark:text-white">
                    {item.city}, {item.country}
                  </h3>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {new Date(item.createdAt).toLocaleString()} ·{' '}
                    {item._count?.companies ?? item.totalFound} companies
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <StatusBadge status={item.status} />
                    <span className="badge-muted">{item.maxResults} max</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 sm:shrink-0">
                <button onClick={() => handleDownload(item, 'csv')} className="btn-secondary !rounded-lg !py-2 !text-xs">
                  CSV
                </button>
                <button onClick={() => handleDownload(item, 'excel')} className="btn-secondary !rounded-lg !py-2 !text-xs">
                  Excel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'completed'
      ? 'badge-success'
      : status === 'failed'
        ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300 badge'
        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 badge';
  return <span className={cls}>{status}</span>;
}
