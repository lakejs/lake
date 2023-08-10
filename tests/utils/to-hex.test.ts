import { expect } from 'chai';
import { toHex } from '../../src/utils';

describe('toHex of utils', () => {
  it('convert colors in RGB format to hex format', () => {
    expect(toHex('rgb(255, 255, 255) none repeat')).to.equal('#ffffff none repeat');
    expect(toHex('rgba(255, 255, 255, 0) none repeat')).to.equal('#ffffff none repeat');
  });
});
