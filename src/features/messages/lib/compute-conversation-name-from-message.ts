const CONVERSATION_AUTO_NAME_MAX_LENGTH = 60;

export function computeConversationNameFromMessage(text: string): string {
  const trimmed = text.trim();
  const collapsed = trimmed.replace(/\s+/g, ' ');
  if (collapsed.length <= CONVERSATION_AUTO_NAME_MAX_LENGTH) {
    return collapsed;
  }
  return `${collapsed.slice(0, CONVERSATION_AUTO_NAME_MAX_LENGTH).trimEnd()}…`;
}
