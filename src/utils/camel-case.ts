export function camelCase(value: string): string {
  const valueList = value.split('-');
  let camelString = '';
  valueList.forEach((val, index) => {
    camelString += (index > 0) ? val.charAt(0).toUpperCase() + val.substring(1) : val;
  });
  return camelString;
}
