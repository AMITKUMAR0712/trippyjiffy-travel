import { useForm } from 'react-hook-form';
import type { ReactNode } from 'react';
import type { SearchFormData, SearchMode, AppConfig } from '../types';
import { CATEGORIES, DEFAULT_CATEGORIES } from '../types';
import { useEffect, useState } from 'react';
import { searchApi } from '../services/api';

interface SearchPanelProps {
  onSearch: (data: SearchFormData) => void;
  isLoading: boolean;
}

export default function SearchPanel({ onSearch, isLoading }: SearchPanelProps) {
  const [config, setConfig] = useState<AppConfig | null>(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<SearchFormData>({
    defaultValues: {
      searchMode: 'city',
      country: '',
      city: '',
      maxResults: 30,
      categories: [...DEFAULT_CATEGORIES],
    },
  });

  const searchMode = watch('searchMode') as SearchMode;
  const selectedCategories = watch('categories') || [];

  useEffect(() => {
    searchApi.getConfig().then(({ data }) => setConfig(data.data)).catch(() => {});
  }, []);

  return (
    <div className="card overflow-hidden !p-0">
      <div className="border-b border-surface-200/80 bg-gradient-to-r from-brand-50/80 to-indigo-50/50 px-6 py-5 dark:border-slate-800 dark:from-brand-950/30 dark:to-indigo-950/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h2 className="section-title">Search Filters</h2>
            <p className="section-subtitle !mt-0">Configure your lead search</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSearch)} className="space-y-5 p-6">
        {config?.apiKeyConfigured && (
          <div className="flex items-start gap-2 rounded-xl border border-emerald-200/60 bg-emerald-50/50 px-3 py-2.5 text-xs text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/20 dark:text-emerald-300">
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Defaults optimized for free tier: Single City, 30 results.</span>
          </div>
        )}

        <Field label="Search Mode">
          <select {...register('searchMode')} className="input-field" disabled={isLoading}>
            <option value="city">Single City (recommended)</option>
            <option value="country">Whole Country</option>
            <option value="worldwide">Worldwide (30+ cities)</option>
          </select>
        </Field>

        {searchMode !== 'worldwide' && (
          <Field label="Country" required error={errors.country?.message}>
            <input
              {...register('country', { required: 'Country is required' })}
              className="input-field"
              placeholder="India, United States, UAE..."
              disabled={isLoading}
            />
          </Field>
        )}

        {searchMode === 'city' && (
          <Field label="City" required error={errors.city?.message}>
            <input
              {...register('city', { required: 'City is required' })}
              className="input-field"
              placeholder="Mumbai, Dubai, London..."
              disabled={isLoading}
            />
          </Field>
        )}

        {searchMode === 'worldwide' && (
          <InfoBox variant="info">
            Searches 30+ global cities including NYC, London, Dubai, Mumbai, Tokyo & more.
          </InfoBox>
        )}

        {searchMode === 'country' && (
          <InfoBox variant="muted">
            All major cities in the selected country will be searched automatically.
          </InfoBox>
        )}

        <Field label="Search Radius" hint="Optional — meters">
          <input
            type="number"
            {...register('radius', {
              min: { value: 1000, message: 'Minimum 1000' },
              max: { value: 50000, message: 'Maximum 50000' },
            })}
            className="input-field"
            placeholder="e.g. 10000"
            disabled={isLoading || searchMode === 'worldwide'}
          />
          {errors.radius && <ErrorText>{errors.radius.message}</ErrorText>}
        </Field>

        <Field label="Max Results" hint="10 – 500">
          <input
            type="number"
            {...register('maxResults', {
              required: true,
              min: { value: 10, message: 'Minimum 10' },
              max: { value: 500, message: 'Maximum 500' },
              valueAsNumber: true,
            })}
            className="input-field"
            disabled={isLoading}
          />
          {errors.maxResults && <ErrorText>{errors.maxResults.message}</ErrorText>}
        </Field>

        <Field label="Categories" hint={`${selectedCategories.length} selected`}>
          <div className="max-h-44 space-y-1 overflow-y-auto rounded-xl border border-surface-200 bg-slate-50/50 p-2 dark:border-slate-700 dark:bg-slate-800/30">
            {CATEGORIES.map((category) => (
              <label
                key={category}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white dark:hover:bg-slate-800"
              >
                <input
                  type="checkbox"
                  value={category}
                  {...register('categories')}
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-slate-700 dark:text-slate-300">{category}</span>
              </label>
            ))}
          </div>
        </Field>

        <button type="submit" disabled={isLoading} className="btn-primary w-full !py-3.5">
          {isLoading ? (
            <>
              <Spinner /> Searching...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchMode === 'worldwide' ? 'Search Worldwide' : 'Search Companies'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  error,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
      </div>
      {children}
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-xs text-red-500">{children}</p>;
}

function InfoBox({ children, variant }: { children: ReactNode; variant: 'info' | 'muted' }) {
  const cls =
    variant === 'info'
      ? 'border-brand-200/60 bg-brand-50/50 text-brand-800 dark:border-brand-800/40 dark:bg-brand-950/20 dark:text-brand-300'
      : 'border-surface-200 bg-slate-50/50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/30 dark:text-slate-400';
  return (
    <p className={`rounded-xl border px-3 py-2.5 text-xs leading-relaxed ${cls}`}>{children}</p>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
