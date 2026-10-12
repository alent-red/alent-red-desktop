export function truncateMiddle(text: string, maxChars: number): string {
  if (text.length <= maxChars) {
    return text;
  }
  if (maxChars <= 1) {
    return '…';
  }
  const visible = maxChars - 1;
  const front = Math.ceil(visible / 2);
  const back = visible - front;
  return `${text.slice(0, front)}…${text.slice(text.length - back)}`;
}
