// Converts an alpha value to a hex value.
function alphaToHex(value: string): string {
  const hexString = Math.round(Number.parseFloat(value) * 255).toString(16);
  return hexString.length > 1 ? hexString : `0${hexString}`;
}

// Converts a decimal to a hex value.
function hex(value: string) {
  const hexString = Number.parseInt(value, 10).toString(16).toLowerCase();
  return hexString.length > 1 ? hexString : `0${hexString}`;
}

// Converting colors in RGB or RGBA format to hex format.
export function toHex(value: string): string {
  return value.replace(
    /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/ig,
    ($0, $1, $2, $3, $4) => {
      if ($4 === undefined) {
        return `#${hex($1)}${hex($2)}${hex($3)}`;
      }
      return `#${hex($1)}${hex($2)}${hex($3)}${alphaToHex($4)}`;
    },
  );
}
