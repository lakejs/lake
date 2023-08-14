import { expect } from 'chai';
import { getCss } from '../../src/utils';

describe('utils.getCss()', () => {
  it('to get computed CSS value', () => {
    const element = document.createElement('div');
    element.style.color = '#ff0000';
    element.style.border = '1px solid #0000ff';
    document.body.appendChild(element);
    expect(getCss(element, 'color')).to.equal('#ff0000');
    expect(getCss(element, 'border-color')).to.equal('#0000ff');
    expect(getCss(element, 'background-color')).to.equal('#000000');
    document.body.removeChild(element);
  });
});
