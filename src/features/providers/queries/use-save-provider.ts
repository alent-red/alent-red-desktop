import {
  type DefaultError,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { providersApi } from '@/features/providers/apis/providers-api';
import { providerQueryKeys } from '@/features/providers/queries/provider-query-keys';
import type { Provider } from '@/features/providers/types/provider';
import type { ProviderInput } from '@/features/providers/types/provider-input';

interface SaveProviderArgs {
  input: ProviderInput;
  id: string | null;
}

export function useSaveProvider(): UseMutationResult<Provider, DefaultError, SaveProviderArgs> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: SaveProviderArgs): Promise<Provider> =>
      providersApi.save(args.input, args.id ?? undefined),
    onSuccess: (saved: Provider): void => {
      queryClient.setQueryData(providerQueryKeys.single(saved.id), saved);
      void queryClient.invalidateQueries({ queryKey: providerQueryKeys.list });
    },
  });
}
