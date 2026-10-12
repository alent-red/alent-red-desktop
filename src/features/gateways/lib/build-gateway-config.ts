import type { GatewayConfig } from '@/features/gateways/types/gateway-config';
import { GatewayConfigType } from '@/features/gateways/types/gateway-config-type';

export interface BuildGatewayConfigInputs {
  trimmedToken: string;
  allowAll: boolean;
  allowedUserNames: string[];
}

export function buildGatewayConfig(inputs: BuildGatewayConfigInputs): GatewayConfig {
  return {
    type: GatewayConfigType.Telegram,
    token: inputs.trimmedToken,
    allowAll: inputs.allowAll,
    allowedUserNames: inputs.allowedUserNames,
  };
}
