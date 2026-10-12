import type { LucideIcon } from 'lucide-react';
import { MessageCircle, MessageSquare, Phone, Send } from 'lucide-react';

import { GatewayConfigType } from '@/features/gateways/types/gateway-config-type';

export const GATEWAY_KIND_ICON: Record<GatewayConfigType, LucideIcon> = {
  [GatewayConfigType.Telegram]: Send,
  [GatewayConfigType.Whatsapp]: MessageCircle,
  [GatewayConfigType.Wechat]: MessageCircle,
  [GatewayConfigType.Signal]: Phone,
  [GatewayConfigType.Messenger]: MessageSquare,
  [GatewayConfigType.Discord]: MessageSquare,
};
