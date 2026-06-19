export function encodeText(text: string): string {
  const encoded = btoa(encodeURIComponent(text));
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeText(encoded: string): string {
  let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  try {
    return decodeURIComponent(atob(base64));
  } catch {
    return '';
  }
}

export function generateShareUrl(text: string): string {
  const encoded = encodeText(text);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#/s/${encoded}`;
}

export function getTextFromUrl(): string | null {
  const hash = window.location.hash;
  const match = hash.match(/^#\/s\/(.+)$/);
  if (match) {
    return decodeText(match[1]);
  }
  return null;
}
