function hex(value: string) {
  const hexString = window.parseInt(value, 10).toString(16).toLowerCase();
  return hexString.length > 1 ? hexString : `0${hexString}`;
}

// Converting colors in RGB format to hex format
export function toHex(value: string): string {
  return value.replace(
    /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*\d+\s*)?\)/ig,
    ($0, $1, $2, $3) => `#${hex($1)}${hex($2)}${hex($3)}`,
  );
}
