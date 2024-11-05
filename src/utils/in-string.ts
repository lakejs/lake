// Returns a boolean value indicating whether a certain value is part of a string, separated by a delimiter.
export function inString(string: string, value: string, delimiter?: string): boolean {
  if (delimiter === undefined) {
    delimiter = ',';
  }
  return (delimiter + string + delimiter).indexOf(delimiter + value + delimiter) >= 0;
}
