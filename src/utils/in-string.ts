// Returns a boolean value indicating whether the specified string includes the value.
export function inString(string: string, value: string, delimiter?: string): boolean {
  if (delimiter === undefined) {
    delimiter = ',';
  }
  return (delimiter + string + delimiter).indexOf(delimiter + value + delimiter) >= 0;
}
