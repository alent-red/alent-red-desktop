import { GATEWAY_KIND_ICON } from '@/features/gateways/constants/gateway-kind-icon';
import { GATEWAY_KIND_LABEL_KEY } from '@/features/gateways/constants/gateway-kind-label-key';
import { GatewayConfigType } from '@/features/gateways/types/gateway-config-type';
import type { KindOption } from '@/shared/views/kind-picker';

export const GATEWAY_KIND_OPTIONS: KindOption<GatewayConfigType>[] = [
  {
    value: GatewayConfigType.Telegram,
    labelKey: GATEWAY_KIND_LABEL_KEY[GatewayConfigType.Telegram],
    icon: GATEWAY_KIND_ICON[GatewayConfigType.Telegram],
  },
  {
    value: GatewayConfigType.Whatsapp,
    labelKey: GATEWAY_KIND_LABEL_KEY[GatewayConfigType.Whatsapp],
    icon: GATEWAY_KIND_ICON[GatewayConfigType.Whatsapp],
    disabled: true,
    disabledTooltipKey: 'common.comingSoon',
  },
  {
    value: GatewayConfigType.Wechat,
    labelKey: GATEWAY_KIND_LABEL_KEY[GatewayConfigType.Wechat],
    icon: GATEWAY_KIND_ICON[GatewayConfigType.Wechat],
    disabled: true,
    disabledTooltipKey: 'common.comingSoon',
  },
  {
    value: GatewayConfigType.Signal,
    labelKey: GATEWAY_KIND_LABEL_KEY[GatewayConfigType.Signal],
    icon: GATEWAY_KIND_ICON[GatewayConfigType.Signal],
    disabled: true,
    disabledTooltipKey: 'common.comingSoon',
  },
  {
    value: GatewayConfigType.Messenger,
    labelKey: GATEWAY_KIND_LABEL_KEY[GatewayConfigType.Messenger],
    icon: GATEWAY_KIND_ICON[GatewayConfigType.Messenger],
    disabled: true,
    disabledTooltipKey: 'common.comingSoon',
  },
  {
    value: GatewayConfigType.Discord,
    labelKey: GATEWAY_KIND_LABEL_KEY[GatewayConfigType.Discord],
    icon: GATEWAY_KIND_ICON[GatewayConfigType.Discord],
    disabled: true,
    disabledTooltipKey: 'common.comingSoon',
  },
];
