const blockAttributeRules: any = {
  id: /^[\w-]+$/,
  class: /^[\w- ]+$/,
  style: {
    'text-align': ['left', 'center', 'right', 'justify', 'start', 'end'],
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
      type: ['info', 'tip', 'success', 'warning', 'error', 'danger'],
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
        'border-width': /^-?\d+px$/i,
        'border-style': /^[\w-]+$/,
        'border-color': /^[^"]+$/,
        'background-color': /^[^"]+$/,
      },
    },
    tr: {
      style: {
        height: /^-?\d+(px|%)$/i,
      },
    },
    th: 'td',
    td: {
      colspan: /^\d+$/,
      rowspan: /^\d+$/,
      style: {
        width: /^-?\d+(px|%)$/i,
        height: /^-?\d+(px|%)$/i,
        border: /^[^"]+$/,
        'border-width': /^-?\d+px$/i,
        'border-style': /^[\w-]+$/,
        'border-color': /^[^"]+$/,
        'background-color': /^[^"]+$/,
        'text-align': ['left', 'center', 'right', 'justify'],
      },
    },
    'lake-box': {
      type: ['inline', 'block'],
      name: /^[\w-]+$/,
      value: /^[^"]+$/,
      focus: ['start', 'center', 'end'],
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
      class: /^[\w- ]+$/,
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
      class: /^[\w- ]+$/,
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
