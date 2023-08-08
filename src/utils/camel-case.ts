export function camelCase(value: string): string {
  const valueArray = value.split('-');
  let camelString = '';
  valueArray.forEach((val, index) => {
    camelString += (index > 0) ? val.charAt(0).toUpperCase() + val.substring(1) : val;
  });
  return camelString;
}
