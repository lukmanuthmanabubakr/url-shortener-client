import { useState } from 'react';
import type { SubmitEvent } from 'react';

interface ShortenFormProps {
  onSubmit: (longUrl: string) => void;
  isLoading: boolean;
}

export function ShortenForm({ onSubmit, isLoading }: ShortenFormProps) {
  const [longUrl, setLongUrl] = useState('');

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!longUrl.trim()) return;
    onSubmit(longUrl.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="url"
        value={longUrl}
        onChange={(event) => setLongUrl(event.target.value)}
        placeholder="Paste a long URL to compress"
        disabled={isLoading}
        required
        className="flex-1 bg-surface text-text placeholder:text-text/40 font-body text-sm rounded-lg px-4 py-3 border border-text/10 focus:border-forge focus:outline-none transition-colors disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-forge text-bg font-body font-medium text-sm rounded-lg px-6 py-3 hover:brightness-110 active:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Forging…' : 'Shorten'}
      </button>
    </form>
  );
}