export function searchString(value: string, searchString: string, delimiter?: string): boolean {
  if (delimiter === undefined) {
    delimiter = ',';
  }
  return (delimiter + value + delimiter).indexOf(delimiter + searchString + delimiter) >= 0;
}
