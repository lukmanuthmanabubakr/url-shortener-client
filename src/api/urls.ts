import { apiClient } from './client';

export interface ShortenedUrl {
  key: string;
  shortUrl: string;
  longUrl: string;
  createdAt: string;
}

export interface UrlListItem {
  key: string;
  shortUrl: string;
  longUrl: string;
  createdAt: string;
  isActive: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedUrls {
  data: UrlListItem[];
  pagination: PaginationMeta;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

export async function shortenUrl(longUrl: string): Promise<ShortenedUrl> {
  const response = await apiClient.post<ShortenedUrl>('/api/shorten', { longUrl });
  return response.data;
}

export async function getUrls(page: number, limit: number): Promise<PaginatedUrls> {
  const response = await apiClient.get<PaginatedUrls>('/api/urls', {
    params: { page, limit },
  });
  return response.data;
}

export async function deactivateUrl(key: string): Promise<void> {
  await apiClient.delete(`/api/urls/${key}`);
}