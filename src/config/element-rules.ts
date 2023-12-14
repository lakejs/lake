const blockAttributeRules: any = {
  id: /^[\w-]+$/,
  class: /^[\w-]+$/,
  style: {
    'text-align': ['left', 'center', 'right', 'justify'],
    'margin-left': /^-?\d+px$/i,
    'text-indent': /^-?\d+em$/i,
  },
};

export function getElementRules(): any {
  return {
    h1: {
      ...blockAttributeRules,
    },
    h2: {
      ...blockAttributeRules,
    },
    h3: {
      ...blockAttributeRules,
    },
    h4: {
      ...blockAttributeRules,
    },
    h5: {
      ...blockAttributeRules,
    },
    h6: {
      ...blockAttributeRules,
    },
    p: {
      ...blockAttributeRules,
    },
    blockquote: {
      ...blockAttributeRules,
      type: ['success', 'info', 'warning', 'error'],
    },
    ul: {
      ...blockAttributeRules,
      type: 'checklist',
    },
    ol: {
      ...blockAttributeRules,
      start: /^\d+$/,
    },
    li: {
      value: ['true', 'false'],
    },
    'lake-box': {
      type: ['inline', 'block'],
      name: /^[\w-]+$/,
      value: /^\S+$/,
      focus: ['left', 'center', 'right'],
    },
    span: {
      class: /^[\w-]+$/,
      style: {
        color: /^\S+$/,
        'background-color': /^\S+$/,
        'font-family': /^\S+$/,
        'font-size': /^\S+$/,
      },
    },
    b: 'strong',
    strong: {},
    em: 'i',
    i: {},
    u: {},
    s: {},
    sub: {},
    sup: {},
    code: {},
    a: {
      href: /^\S+$/,
      target: /^[\w-]+$/,
    },
    br: {},
    'lake-bookmark': {
      type: ['anchor', 'focus'],
    },
  };
}
