import { invoke } from '@/shared/invoke/invoke';

export interface InfoDto {
  version: string;
  pid: number;
}

export const infoApi = {
  get: (): Promise<InfoDto> => invoke<InfoDto>('info_get'),
};
