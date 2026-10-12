const BRAND_AGENT_NAME = 'alent red';

// The brand agent gets the brand color for its avatar. Names are normalized so
// "Alent.Red", "alent red", and any dotted/spaced variant all match.
export function isBrandAgentName(name: string): boolean {
  const normalized = name.toLowerCase().replace(/[.&]/g, ' ').replace(/\s+/g, ' ').trim();
  return normalized === BRAND_AGENT_NAME;
}
