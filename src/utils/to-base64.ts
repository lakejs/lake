// Creates a Base64-encoded ASCII string from a string.
export function toBase64(value: string) {
  const encoder = new TextEncoder();
  const byteArray = encoder.encode(value);
  let binaryString = '';
  byteArray.forEach(byte => {
    binaryString += String.fromCharCode(byte);
  });
  return window.btoa(binaryString);
}
