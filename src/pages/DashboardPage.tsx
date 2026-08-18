import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUrls } from '../hooks/useUrls';
import { useDeactivateUrl } from '../hooks/useDeactivateUrl';
import { LinksTable } from '../components/LinksTable';
import { EmptyState } from '../components/EmptyState';
import { TableSkeleton } from '../components/TableSkeleton';

const LIMIT = 20;

export function DashboardPage() {
  const { logout } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useUrls(page, LIMIT);
  const deactivateMutation = useDeactivateUrl(page, LIMIT);

  const filteredUrls = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data.data;

    const query = search.trim().toLowerCase();
    return data.data.filter(
      (url) =>
        url.key.toLowerCase().includes(query) ||
        url.longUrl.toLowerCase().includes(query)
    );
  }, [data, search]);

  function handleDeactivate(key: string) {
    deactivateMutation.mutate(key);
  }

  return (
    <main className="min-h-screen bg-bg text-text px-4 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="font-body text-xs uppercase tracking-wider text-quench mb-1">
              Dashboard
            </p>
            <h1 className="font-display text-3xl font-semibold">Your links</h1>
          </div>
          <button
            onClick={logout}
            className="font-body text-xs text-text/50 hover:text-text border border-text/10 hover:border-text/30 rounded-md px-3 py-2 transition-colors"
          >
            Log out
          </button>
        </div>

        <div className="bg-surface rounded-xl border border-text/10 overflow-hidden">
          <div className="p-5 border-b border-text/10">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Filter this page…"
              className="w-full bg-bg text-text placeholder:text-text/40 font-body text-sm rounded-lg px-4 py-2.5 border border-text/10 focus:border-forge focus:outline-none transition-colors"
            />
          </div>

          {deactivateMutation.isError && (
            <p className="font-body text-sm text-forge text-center py-3 border-b border-text/10" role="alert">
              Couldn't deactivate that link. It's been restored, try again.
            </p>
          )}

          <div className="p-5">
            {isLoading && <TableSkeleton />}

            {isError && (
              <p className="font-body text-sm text-forge text-center py-12" role="alert">
                Couldn't load your links. Try refreshing the page.
              </p>
            )}

            {!isLoading && !isError && data && data.data.length === 0 && <EmptyState />}

            {!isLoading && !isError && data && data.data.length > 0 && (
              <>
                <LinksTable
                  urls={filteredUrls}
                  onDeactivate={handleDeactivate}
                  isDeactivating={deactivateMutation.isPending}
                />

                {search.trim() && filteredUrls.length === 0 && (
                  <p className="font-body text-sm text-text/40 text-center py-8">
                    No links on this page match "{search}".
                  </p>
                )}
              </>
            )}
          </div>

          {!isLoading && !isError && data && data.data.length > 0 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-text/10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="font-body text-xs font-medium text-text/70 hover:text-text bg-bg border border-text/10 hover:border-text/30 rounded-md px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-text/10 transition-colors"
              >
                ← Previous
              </button>
              <span className="font-mono text-xs text-text/40">
                {data.pagination.page} / {data.pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page >= data.pagination.totalPages}
                className="font-body text-xs font-medium text-text/70 hover:text-text bg-bg border border-text/10 hover:border-text/30 rounded-md px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-text/10 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}