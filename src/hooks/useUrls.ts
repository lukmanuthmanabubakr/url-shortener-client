import { useQuery } from '@tanstack/react-query';
import { getUrls } from '../api/urls';

export function useUrls(page: number, limit: number = 20) {
  return useQuery({
    queryKey: ['urls', page, limit],
    queryFn: () => getUrls(page, limit),
  });
}