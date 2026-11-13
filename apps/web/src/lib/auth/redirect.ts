export function safeNextPath(value: string | null | undefined, fallback = "/"): string {
  if (!value) {
    return fallback;
  }

  let candidate = value.trim();

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      candidate = decodeURIComponent(candidate);
    } catch {
      return fallback;
    }
  }

  if (!candidate.startsWith("/") || candidate.startsWith("//") || candidate.startsWith("/\\")) {
    return fallback;
  }

  if (/^[a-z][a-z0-9+.-]*:/i.test(candidate)) {
    return fallback;
  }

  if (candidate.includes("\\")) {
    return fallback;
  }

  for (const character of candidate) {
    const code = character.charCodeAt(0);

    if (code <= 0x1f || code === 0x7f) {
      return fallback;
    }
  }

  return candidate;
}
