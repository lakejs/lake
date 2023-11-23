import { expect } from 'chai';
import { toHex } from '../../src/utils';

describe('utils / to-hex', () => {

  it('converts colors in RGB format to hex format', () => {
    expect(toHex('rgb(255, 255, 255) none repeat')).to.equal('#ffffff none repeat');
    expect(toHex('rgba(0, 0, 0, 0.88) none repeat')).to.equal('#000000e0 none repeat');
  });

});
