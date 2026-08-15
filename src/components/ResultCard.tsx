import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { ShortenedUrl } from '../api/urls';

interface ResultCardProps {
  result: ShortenedUrl;
}

export function ResultCard({ result }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail (permissions, insecure context). We
      // silently no-op here rather than showing an error, since the
      // short URL is still visible and selectable by hand as a fallback.
    }
  }

  return (
    <div className="animate-forge-glow bg-surface rounded-xl p-5 mt-6 flex flex-col sm:flex-row items-center gap-5">
      <div className="flex-1 w-full">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm sm:text-base text-text truncate">
            {result.shortUrl}
          </span>
          <button
            onClick={handleCopy}
            className="shrink-0 bg-quench/20 text-quench font-body text-xs font-medium rounded-md px-3 py-1.5 hover:bg-quench/30 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="font-body text-xs text-text/40 mt-2 truncate">
          {result.longUrl}
        </p>
      </div>
      <div className="bg-bg rounded-lg p-3 shrink-0">
        <QRCodeSVG
          value={result.shortUrl}
          size={100}
          fgColor="#EDE8E0"
          bgColor="transparent"
          marginSize={0}
        />
      </div>
    </div>
  );
}