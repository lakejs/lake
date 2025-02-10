export const blockTagNames = new Set<string>([
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'div',
  'p',
  'blockquote',
  'ul',
  'ol',
  'li',
  'table',
  'tr',
  'th',
  'td',
]);

export const markTagNames = new Set<string>([
  'span',
  'strong',
  'em',
  'i',
  'u',
  's',
  'sup',
  'sub',
  'code',
]);

// https://developer.mozilla.org/en-US/docs/Glossary/Void_element
export const voidTagNames = new Set<string>([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

export const headingTagNames = new Set<string>([
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
]);

export const listTagNames = new Set<string>([
  'ol',
  'ul',
  'li',
]);

export const tableTagNames = new Set<string>([
  'table',
  'tr',
  'td',
]);
