export type BoxType = 'inline' | 'block';

export type BoxValue = { [key: string]: any };

export type BoxRender = (value?: BoxValue) => string;

export type BoxDefinition = {
  type: BoxType;
  name: string;
  value?: BoxValue;
  render: BoxRender;
};
