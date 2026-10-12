export const gatewayQueryKeys = {
  all: ['gateways'] as const,
  list: (agentId: string | null): readonly ['gateways', string | null] =>
    ['gateways', agentId] as const,
  single: (id: string): readonly ['gateway', string] => ['gateway', id] as const,
};
