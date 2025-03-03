export type ContentStyleValue = string | string[] | RegExp;

export type ContentStyle = Record<string, ContentStyleValue>;

export type ContentAttributeValue = string | string[] | RegExp | ContentStyle;

export type ContentAttribute = Record<string, ContentAttributeValue>;

export type ContentRules = Record<string, string | ContentAttribute>;
