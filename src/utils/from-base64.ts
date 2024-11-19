// Decodes a string of data which has been encoded using Base64 encoding.
export function fromBase64(value: string): string {
  const binaryString = window.atob(value);
  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }
  const decoder = new TextDecoder();
  return decoder.decode(byteArray);
}
