import { expect } from 'chai';
import { parseStyle } from '../../src/utils';

describe('utils.parseStyle()', () => {

  it('to parse style string', () => {
    const properties = parseStyle('color: red; border: 1px solid #ccc; margin-right: 10px;');
    expect(properties.color).to.equal('red');
    expect(properties.border).to.equal('1px solid #ccc');
    expect(properties['margin-right']).to.equal('10px');
  });

});
