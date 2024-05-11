// Returns the text of keyboard shortcuts used for a tooltip or help.
// Mac: mod+Z returns ⌘+Z
// Windows / Linux: mod+Z returns Ctrl+Z
export function modifierText(value: string, userAgent?: string): string {
  // for generating i18n files
  if (typeof window === 'undefined') {
    return value;
  }
  userAgent = userAgent ?? navigator.userAgent;
  const isMac = userAgent.indexOf('Mac OS X') >= 0;
  const modText = isMac ? '⌘' : 'Ctrl';
  return value.replace(/(^|\+|\s)mod(\+|\s|$)/g, `$1${modText}$2`);
}
