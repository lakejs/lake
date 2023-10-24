// Converts an alpha value to a hex value.
function alphaToHex(value: string): string {
  const hexString = Math.round(Number.parseFloat(value) * 255).toString(16);
  return hexString.length > 1 ? hexString : `0${hexString}`;
}

// Converts a decimal to a hex value.
function hex(value: string): string {
  const hexString = Number.parseInt(value, 10).toString(16).toLowerCase();
  return hexString.length > 1 ? hexString : `0${hexString}`;
}

// Converting colors in RGB or RGBA format to hex format.
export function toHex(value: string): string {
  return value.replace(
    /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/ig,
    (match, p1, p2, p3, p4) => {
      if (p4 === undefined) {
        return `#${hex(p1)}${hex(p2)}${hex(p3)}`;
      }
      return `#${hex(p1)}${hex(p2)}${hex(p3)}${alphaToHex(p4)}`;
    },
  );
}
