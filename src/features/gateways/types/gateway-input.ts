import type { GatewayConfig } from '@/features/gateways/types/gateway-config';

export interface GatewayInput {
  name: string;
  sendDetailedMessages: boolean;
  config: GatewayConfig;
  agentId: string;
}
