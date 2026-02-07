const MINOR_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "from",
  "in",
  "nor",
  "of",
  "on",
  "or",
  "per",
  "the",
  "to",
  "via",
  "vs",
  "with",
]);

function normalizeWordCase(word: string, keepLowercase: boolean) {
  const normalized = word.toLowerCase();
  if (keepLowercase) return normalized;

  return normalized.replace(/[a-z]/, (char) => char.toUpperCase());
}

function normalizeTokenCase(token: string, tokenIndex: number, totalTokens: number) {
  const parts = token.split("-");
  const normalizedParts = parts.map((part, partIndex) => {
    const lettersOnly = part.replace(/[^A-Za-z]/g, "");
    if (!lettersOnly) return part;

    if (/^[A-Z]{2,4}$/.test(lettersOnly)) return part.toUpperCase();

    const isFirstToken = tokenIndex === 0 && partIndex === 0;
    const isLastToken = tokenIndex === totalTokens - 1 && partIndex === parts.length - 1;
    const keepLowercase = !isFirstToken && !isLastToken && MINOR_WORDS.has(lettersOnly.toLowerCase());

    return normalizeWordCase(part, keepLowercase);
  });

  return normalizedParts.join("-");
}

// Normalize expense descriptions into consistent English-style title casing.
export function normalizeExpenseDescription(input: string) {
  const cleaned = input.trim().replace(/\s+/g, " ");
  if (!cleaned) return cleaned;

  const tokens = cleaned.split(" ");
  return tokens
    .map((token, tokenIndex) => normalizeTokenCase(token, tokenIndex, tokens.length))
    .join(" ");
}
