import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deactivateUrl } from '../api/urls';
import type { PaginatedUrls } from '../api/urls';

export function useDeactivateUrl(page: number, limit: number = 20) {
  const queryClient = useQueryClient();
  const queryKey = ['urls', page, limit];

  return useMutation({
    mutationFn: deactivateUrl,

    onMutate: async (key: string) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<PaginatedUrls>(queryKey);

      queryClient.setQueryData<PaginatedUrls>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((url) =>
            url.key === key ? { ...url, isActive: false } : url
          ),
        };
      });

      return { previousData };
    },

    onError: (_err, _key, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}