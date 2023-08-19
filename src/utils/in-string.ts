// Search for a specified value within an string and return true or false (false if not found).
export function inString(string: string, value: string, delimiter?: string): boolean {
  if (delimiter === undefined) {
    delimiter = ',';
  }
  return (delimiter + string + delimiter).indexOf(delimiter + value + delimiter) >= 0;
}
