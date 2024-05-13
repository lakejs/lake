import { fileSize } from '../../src/utils';

describe('utils / fileSize', () => {

  it('should return correct values', () => {
    expect(fileSize(0)).to.equal('0 KB');
    expect(fileSize(1024 * 0.01)).to.equal('0.1 KB');
    expect(fileSize(1024 * 0.05)).to.equal('0.1 KB');
    expect(fileSize(1024 * 0.44)).to.equal('0.4 KB');
    expect(fileSize(1024 * 0.5)).to.equal('0.5 KB');
    expect(fileSize(2 * 1024)).to.equal('2.0 KB');
    expect(fileSize(2 * 1024 * 1024)).to.equal('2.0 MB');
    expect(fileSize(2 * 1024 * 1024 * 1024)).to.equal('2.0 GB');
    expect(fileSize(2 * 1024 * 1024 * 1024 * 1024)).to.equal('2048.0 GB');
  });

});
