export function ensureNaturalNumber(value) {
  if (
    typeof value !== "number" ||
    isNaN(value) ||
    value === Infinity ||
    value === -Infinity
  ) {
    return 0;
  }
  return value;
}
