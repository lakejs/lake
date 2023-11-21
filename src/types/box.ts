export type BoxValue = { [key: string]: any };

export type Box = {
  type: 'inline' | 'block';
  name: string;
  value?: BoxValue;
  render: (value?: BoxValue) => string;
};
