import type { Blob } from '@/features/blob/types/blob';
import type { BlobInput } from '@/features/blob/types/blob-input';
import { invoke } from '@/shared/invoke/invoke';

export const blobApi = {
  save: (blob: BlobInput): Promise<string> => invoke<string>('blob_save', { blob }),
  read: (key: string): Promise<Blob> => invoke<Blob>('blob_read', { key }),
};
