import { GatewayConfigType } from '@/features/gateways/types/gateway-config-type';
import type { TranslationKey } from '@/shared/i18n/translate';

export const GATEWAY_KIND_LABEL_KEY: Record<GatewayConfigType, TranslationKey> = {
  [GatewayConfigType.Telegram]: 'gateways.kindLabelTelegram',
  [GatewayConfigType.Whatsapp]: 'gateways.kindLabelWhatsapp',
  [GatewayConfigType.Wechat]: 'gateways.kindLabelWechat',
  [GatewayConfigType.Signal]: 'gateways.kindLabelSignal',
  [GatewayConfigType.Messenger]: 'gateways.kindLabelMessenger',
  [GatewayConfigType.Discord]: 'gateways.kindLabelDiscord',
};
