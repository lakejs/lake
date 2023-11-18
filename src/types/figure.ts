export type FigureValue = { [key: string]: any };

export type Figure = {
  type: 'inline' | 'block';
  name: string;
  value?: FigureValue;
  render: (value?: FigureValue) => string;
};
