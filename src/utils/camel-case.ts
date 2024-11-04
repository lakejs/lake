// Converts the specified string to camel case.
export function camelCase(value: string): string {
  const valueList = value.split('-');
  let camelString = '';
  for (let i = 0; i < valueList.length; i++) {
    const val = valueList[i];
    camelString += (i > 0) ? val.charAt(0).toUpperCase() + val.substring(1) : val;
  }
  return camelString;
}
