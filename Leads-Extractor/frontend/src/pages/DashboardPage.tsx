import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import SearchPanel from '../components/SearchPanel';
import ResultsTable from '../components/ResultsTable';
import ProgressBar from '../components/ProgressBar';
import StatsCards from '../components/StatsCards';
import LoadingSpinner from '../components/LoadingSpinner';
import { searchApi, downloadBlob } from '../services/api';
import type { Company, SearchFormData, Analytics, AppConfig } from '../types';

export default function DashboardPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [searchHistoryId, setSearchHistoryId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  const [lastSearchParams, setLastSearchParams] = useState<SearchFormData | null>(null);

  const loadAnalytics = useCallback(async () => {
    try {
      const { data } = await searchApi.getAnalytics();
      setAnalytics(data.data);
    } catch {
      // optional
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
    searchApi.getConfig().then(({ data }) => setAppConfig(data.data)).catch(() => {});
  }, [loadAnalytics]);

  const handleSearch = async (formData: SearchFormData) => {
    setIsSearching(true);
    setProgress(5);
    setProgressLabel('Initializing search...');
    setLastSearchParams(formData);
    setCompanies([]);

    try {
      const { data } = await searchApi.search(formData);
      const { searchId } = data.data;
      setSearchHistoryId(searchId);

      await new Promise<void>((resolve, reject) => {
        let pollErrors = 0;
        const MAX_POLL_ERRORS = 20;

        const poll = async () => {
          try {
            const { data: statusRes } = await searchApi.getStatus(searchId);
            const status = statusRes.data;
            pollErrors = 0;

            setProgress(status.percent || 5);
            setProgressLabel(status.currentStep || 'Searching...');

            if (status.status === 'completed') {
              const { data: companiesRes } = await searchApi.getCompanies({
                searchHistoryId: searchId,
                limit: formData.maxResults || 100,
              });
              const results = companiesRes.data.companies;
              setCompanies(results);
              setProgress(100);
              setProgressLabel('Search completed!');
              const skipped = status.skippedDuplicates ?? 0;
              if (skipped > 0) {
                toast.success(
                  `Found ${results.length} new companies (${skipped} duplicate${skipped > 1 ? 's' : ''} skipped)`
                );
              } else {
                toast.success(`Found ${results.length} new companies`);
              }
              loadAnalytics();
              resolve();
              return;
            }

            if (status.status === 'failed') {
              reject(new Error(status.error || 'Search failed'));
              return;
            }

            setTimeout(poll, 2000);
          } catch (err) {
            pollErrors++;
            if (pollErrors >= MAX_POLL_ERRORS) {
              reject(err);
              return;
            }
            setProgressLabel('Server busy, retrying...');
            setTimeout(poll, 3000);
          }
        };

        poll();
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Search failed');
      setProgress(0);
      setProgressLabel('');
    } finally {
      setIsSearching(false);
    }
  };

  const handleRefresh = () => {
    if (lastSearchParams) handleSearch(lastSearchParams);
    else toast.error('No previous search to refresh');
  };

  const handleExportCsv = async () => {
    try {
      const params: Record<string, string> = {};
      if (searchHistoryId) params.searchHistoryId = searchHistoryId;
      const { data } = await searchApi.exportCsv(params);
      downloadBlob(data, `travel-companies-${Date.now()}.csv`);
      toast.success('CSV exported successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Export failed');
    }
  };

  const handleExportExcel = async () => {
    try {
      const params: Record<string, string> = {};
      if (searchHistoryId) params.searchHistoryId = searchHistoryId;
      const { data } = await searchApi.exportExcel(params);
      downloadBlob(data, `travel-companies-${Date.now()}.xlsx`);
      toast.success('Excel exported successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Export failed');
    }
  };

  const handleExportPdf = async () => {
    try {
      const params: Record<string, string> = {};
      if (searchHistoryId) params.searchHistoryId = searchHistoryId;
      const { data } = await searchApi.exportPdf(params);
      downloadBlob(data, `travel-companies-${Date.now()}.pdf`);
      toast.success('PDF exported successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Export failed');
    }
  };

  const handleCopyEmails = (emails: string[]) => {
    if (!emails.length) return toast.error('No emails to copy');
    navigator.clipboard.writeText(emails.join('\n'));
    toast.success(`Copied ${emails.length} email(s)`);
  };

  const handleDeleteSelected = async (ids: string[]) => {
    if (!confirm(`Delete ${ids.length} selected companies?`)) return;
    setIsDeleting(true);
    try {
      await searchApi.deleteCompanies(ids);
      setCompanies((prev) => prev.filter((c) => !ids.includes(c.id)));
      toast.success(`Deleted ${ids.length} companies`);
      loadAnalytics();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Delete failed');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="badge-brand">Lead Generation Platform</span>
              {appConfig?.apiKeyConfigured && (
                <span className="badge-success">Live API</span>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-4xl">
              Travel Company{' '}
              <span className="bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent">
                Lead Extractor
              </span>
            </h1>
            <p className="mt-2 max-w-2xl text-base text-slate-500 dark:text-slate-400">
              Discover travel agencies worldwide, extract business emails, and export
              qualified leads — all in one professional workspace.
            </p>
          </div>
        </div>

        {appConfig && !appConfig.apiKeyConfigured && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/80 px-4 py-3.5 backdrop-blur-sm dark:border-amber-800/50 dark:bg-amber-950/20">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                Google API key required
              </p>
              <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-300">
                Add <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[11px] dark:bg-amber-900/50">GOOGLE_MAPS_API_KEY</code> in .env and restart the server.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mb-8">
        <StatsCards analytics={analytics} resultCount={companies.length} />
      </div>

      {isSearching && (
        <div className="card-elevated mb-8">
          <ProgressBar
            percent={progress}
            label={progressLabel}
            status="Fetching company details and scraping websites for emails..."
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="lg:sticky lg:top-24">
            <SearchPanel onSearch={handleSearch} isLoading={isSearching} />
          </div>
        </div>

        <div className="space-y-4 lg:col-span-8 xl:col-span-9">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-surface-200/80 bg-white/60 p-2 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/40">
            <button onClick={handleExportCsv} disabled={!companies.length} className="btn-secondary !rounded-lg !py-2 !text-xs">
              <DownloadIcon /> CSV
            </button>
            <button onClick={handleExportExcel} disabled={!companies.length} className="btn-secondary !rounded-lg !py-2 !text-xs">
              <DownloadIcon /> Excel
            </button>
            <button onClick={handleExportPdf} disabled={!companies.length} className="btn-secondary !rounded-lg !py-2 !text-xs">
              <DownloadIcon /> PDF
            </button>
            <button onClick={handleRefresh} disabled={isSearching || !lastSearchParams} className="btn-secondary !rounded-lg !py-2 !text-xs">
              <RefreshIcon /> Refresh
            </button>
            <div className="ml-auto hidden sm:block">
              <span className="text-xs text-slate-400">
                {companies.length > 0 ? `${companies.length} leads loaded` : 'No results yet'}
              </span>
            </div>
          </div>

          {isSearching && companies.length === 0 ? (
            <div className="card flex min-h-[400px] items-center justify-center">
              <LoadingSpinner size="lg" text="Searching and scraping websites..." />
            </div>
          ) : (
            <ResultsTable
              data={companies}
              onDeleteSelected={handleDeleteSelected}
              onCopyEmails={handleCopyEmails}
              isDeleting={isDeleting}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}
