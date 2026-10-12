import { type GatewayConfigType } from '@/features/gateways/types/gateway-config-type';

export interface GatewayConfig {
  type: typeof GatewayConfigType.Telegram;
  token: string;
  allowAll: boolean;
  allowedUserNames: string[];
}
