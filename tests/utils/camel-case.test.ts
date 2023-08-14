import { expect } from 'chai';
import { camelCase } from '../../src/utils';

describe('utils.camelCase()', () => {
  it('to convert a string to camel case', () => {
    expect(camelCase('background-color')).to.equal('backgroundColor');
    expect(camelCase('backgroundColor')).to.equal('backgroundColor');
    expect(camelCase('color')).to.equal('color');
    expect(camelCase('one-two-three')).to.equal('oneTwoThree');
  });
});
