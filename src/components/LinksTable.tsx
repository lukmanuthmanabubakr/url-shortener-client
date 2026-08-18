import type { UrlListItem } from '../api/urls';

interface LinksTableProps {
  urls: UrlListItem[];
  onDeactivate: (key: string) => void;
  isDeactivating: boolean;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={
        isActive
          ? 'inline-flex items-center gap-1.5 text-xs font-body text-quench'
          : 'inline-flex items-center gap-1.5 text-xs font-body text-text/40'
      }
    >
      <span
        className={
          isActive ? 'w-1.5 h-1.5 rounded-full bg-quench' : 'w-1.5 h-1.5 rounded-full bg-text/30'
        }
      />
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}

export function LinksTable({ urls, onDeactivate, isDeactivating }: LinksTableProps) {
  return (
    <>
      {/* Desktop: real table */}
      <table className="hidden md:table w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="font-body text-xs text-text/40 font-medium uppercase tracking-wide pb-3 pr-4">
              Short URL
            </th>
            <th className="font-body text-xs text-text/40 font-medium uppercase tracking-wide pb-3 pr-4">
              Destination
            </th>
            <th className="font-body text-xs text-text/40 font-medium uppercase tracking-wide pb-3 pr-4">
              Clicks
            </th>
            <th className="font-body text-xs text-text/40 font-medium uppercase tracking-wide pb-3 pr-4">
              Created
            </th>
            <th className="font-body text-xs text-text/40 font-medium uppercase tracking-wide pb-3 pr-4">
              Status
            </th>
            <th className="pb-3"></th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url.key} className="group border-t border-text/5 hover:bg-bg/40 transition-colors">
              <td className="font-mono text-sm text-text py-3.5 pr-4">{url.key}</td>
              <td className="font-body text-sm text-text/60 py-3.5 pr-4">
                {truncate(url.longUrl, 40)}
              </td>
              <td className="font-mono text-sm text-text/30 py-3.5 pr-4">—</td>
              <td className="font-body text-sm text-text/50 py-3.5 pr-4">
                {formatDate(url.createdAt)}
              </td>
              <td className="py-3.5 pr-4">
                <StatusBadge isActive={url.isActive} />
              </td>
              <td className="py-3.5 text-right">
                {url.isActive && (
                  <button
                    onClick={() => onDeactivate(url.key)}
                    disabled={isDeactivating}
                    className="font-body text-xs text-text/40 group-hover:text-forge hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Deactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: stacked cards */}
      <div className="flex md:hidden flex-col gap-3">
        {urls.map((url) => (
          <div key={url.key} className="bg-bg rounded-lg p-4 flex flex-col gap-2 border border-text/5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-text">{url.key}</span>
              <StatusBadge isActive={url.isActive} />
            </div>
            <p className="font-body text-sm text-text/60">{truncate(url.longUrl, 50)}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="font-body text-xs text-text/40">{formatDate(url.createdAt)}</span>
              {url.isActive && (
                <button
                  onClick={() => onDeactivate(url.key)}
                  disabled={isDeactivating}
                  className="font-body text-xs text-forge hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Deactivate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}