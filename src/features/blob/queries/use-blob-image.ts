import { useQuery } from '@tanstack/react-query';

import { blobApi } from '@/features/blob/apis/blob-api';
import { blobQueryKeys } from '@/features/blob/queries/blob-query-keys';

interface UseBlobImageResult {
  dataUrl: string | null;
  isLoading: boolean;
}

const BLOB_CACHE_GC_MS = 5 * 60 * 1000;

export function useBlobImage(key: string | null | undefined): UseBlobImageResult {
  const isEnabled = typeof key === 'string' && key.length > 0;
  const { data, isLoading } = useQuery({
    queryKey: isEnabled ? blobQueryKeys.single(key) : ['blob', null],
    queryFn: async (): Promise<string | null> => {
      if (!isEnabled) {
        return null;
      }
      const blob = await blobApi.read(key);
      return `data:${blob.contentType};base64,${blob.contentBase64}`;
    },
    enabled: isEnabled,
    staleTime: Infinity,
    gcTime: BLOB_CACHE_GC_MS,
  });
  return { dataUrl: data ?? null, isLoading };
}
