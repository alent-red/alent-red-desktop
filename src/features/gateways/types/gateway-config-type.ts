export const GatewayConfigType = {
  Telegram: 'TELEGRAM',
  Whatsapp: 'WHATSAPP',
  Wechat: 'WECHAT',
  Signal: 'SIGNAL',
  Messenger: 'MESSENGER',
  Discord: 'DISCORD',
} as const;
export type GatewayConfigType = (typeof GatewayConfigType)[keyof typeof GatewayConfigType];
