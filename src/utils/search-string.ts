export function searchString(value: string, keyword: string, delimiter?: string): boolean {
  if (delimiter === undefined) {
    delimiter = ',';
  }
  return (delimiter + value + delimiter).indexOf(delimiter + keyword + delimiter) >= 0;
}
