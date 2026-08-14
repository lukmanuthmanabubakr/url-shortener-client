import { apiClient } from "./client";

export interface ShortenedUrl {
  key: string;
  shortUrl: string;
  longUrl: string;
  createdAt: string;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

export async function shortenUrl(longUrl: string): Promise<ShortenedUrl> {
  const response = await apiClient.post<ShortenedUrl>("/api/shorten", {
    longUrl,
  });
  return response.data;
}
