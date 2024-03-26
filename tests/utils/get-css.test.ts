import { getCSS } from '../../src/utils';

describe('utils / get-css', () => {

  it('gets computed CSS value', () => {
    const element = document.createElement('div');
    element.style.color = '#ff0000';
    element.style.border = '1px solid #0000ff';
    document.body.appendChild(element);
    expect(getCSS(element, 'color')).to.equal('#ff0000');
    expect(getCSS(element, 'border-color')).to.equal('#0000ff');
    expect(getCSS(element, 'background-color') === '').to.equal(false);
    document.body.removeChild(element);
  });

});
