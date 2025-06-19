export function useTruncate(text: string, max = 80) {
  const isLong = text.length > max;
  const display = isLong ? text.slice(0, max) + "..." : text;
  return { display, isLong };
}
