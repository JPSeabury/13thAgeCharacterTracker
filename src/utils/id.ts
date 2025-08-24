export function nanoid(size = 12): string {
  const bytes = crypto.getRandomValues(new Uint8Array(size));
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}