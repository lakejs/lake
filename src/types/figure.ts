export type FigureItemValue = { [key: string]: any };

export type FigureItem = {
  type: 'inline' | 'block';
  name: string;
  value: FigureItemValue;
  render: (value: FigureItemValue) => string;
};
