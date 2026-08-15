import { useState } from 'react';
import { AxiosError } from 'axios';
import { shortenUrl } from '../api/urls';
import type { ShortenedUrl, ApiErrorBody } from '../api/urls';
import { ShortenForm } from '../components/ShortenForm';
import { ResultCard } from '../components/ResultCard';

export function LandingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ShortenedUrl | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(longUrl: string) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const shortened = await shortenUrl(longUrl);
      setResult(shortened);
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorBody>;
      const code = axiosError.response?.data?.error?.code;

      if (code === 'VALIDATION_ERROR') {
        setError('That doesn\'t look like a valid URL. Check it and try again.');
      } else {
        setError('Something went wrong shortening that link. Try again in a moment.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-bg text-text flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-2 text-center">
          Compress a URL
        </h1>
        <p className="font-body text-sm text-text/60 text-center mb-8">
          Paste a long link. Get back something small enough to carry.
        </p>

        <ShortenForm onSubmit={handleSubmit} isLoading={isLoading} />

        {error && (
          <p className="font-body text-sm text-forge mt-4 text-center" role="alert">
            {error}
          </p>
        )}

        {result && <ResultCard result={result} />}
      </div>
    </main>
  );
}