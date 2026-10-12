import type { GatewayConfig } from '@/features/gateways/types/gateway-config';
import type { ErrorCode } from '@/shared/types/error-code';

export interface Gateway {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  sendDetailedMessages: boolean;
  config: GatewayConfig;
  agentId: string;
  errorCode: ErrorCode | null;
  errorMessage: string | null;
}
