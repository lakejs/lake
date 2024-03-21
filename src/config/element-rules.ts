const blockAttributeRules: any = {
  id: /^[\w-]+$/,
  class: /^[\w-]+$/,
  style: {
    'text-align': ['left', 'center', 'right', 'justify'],
    'margin-left': /^-?\d+px$/i,
    'text-indent': /^-?\d+em$/i,
  },
};

const tdAttributeRules: any = {
  colspan: /^\d+$/,
  rowspan: /^\d+$/,
  style: {
    width: /^-?\d+(px|%)$/i,
    height: /^-?\d+(px|%)$/i,
    border: /^[^"]+$/,
    'border-width': /^-?\d+px$/i,
    'background-color': /^[^"]+$/,
    'border-color': /^[^"]+$/,
    'border-style': /^[\w-]+$/,
    padding: /^[\s\w-]+$/,
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
      indent: /^\d+$/,
    },
    ol: {
      ...blockAttributeRules,
      start: /^\d+$/,
      indent: /^\d+$/,
    },
    li: {
      value: ['true', 'false'],
    },
    table: {
      style: {
        width: /^-?\d+(px|%)$/i,
        height: /^-?\d+(px|%)$/i,
        border: /^[^"]+$/,
        'border-collapse': ['collapse', 'separate'],
        'border-width': /^-?\d+px$/i,
        'border-color': /^[^"]+$/,
        'border-style': /^[\w-]+$/,
        'background-color': /^[^"]+$/,
      },
    },
    caption: {
      style: {
        'caption-side': /^[\w-]+$/,
        padding: /^[\s\w-]+$/,
      },
    },
    thead: {
      style: {
        'background-color': /^[^"]+$/,
      },
    },
    tbody: {
      style: {
        'background-color': /^[^"]+$/,
      },
    },
    tfoot: {
      style: {
        'background-color': /^[^"]+$/,
      },
    },
    tr: {
      style: {
        height: /^-?\d+(px|%)$/i,
      },
    },
    th: tdAttributeRules,
    td: tdAttributeRules,
    'lake-box': {
      type: ['inline', 'block'],
      name: /^[\w-]+$/,
      value: /^[^"]+$/,
      focus: ['left', 'center', 'right'],
    },
    br: {},
    hr: {},
    img : {
      src: /^[^"]+$/,
      width: /^-?\d+px$/i,
      height: /^-?\d+px$/i,
      'data-lake-value': /^[^"]+$/,
      alt: /^[^"]+$/,
      style: {
        width: /^-?\d+px$/i,
        height: /^-?\d+px$/i,
      },
    },
    span: {
      class: /^[\w-]+$/,
      style: {
        color: /^[^"]+$/,
        'background-color': /^[^"]+$/,
        'font-family': /^[^;]+$/,
        'font-size': /^[^"]+$/,
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
      class: /^[\w-]+$/,
      name: /^[\w-]+$/,
      href: /^[^"]+$/,
      target: /^[\w-]+$/,
      rel: /^[^"]+$/,
      download: /^[^"]+$/,
    },
    'lake-bookmark': {
      type: ['anchor', 'focus'],
    },
  };
}
