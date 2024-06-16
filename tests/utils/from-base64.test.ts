import { fromBase64 } from '../../src/utils';

describe('utils / from-base64', () => {

  it('should decode a string of data which has been encoded using Base64 encoding', () => {
    expect(fromBase64('VGhpcyBpcyAi5rWL6K+V5a2X56ym5LiyIg==')).to.equal('This is "测试字符串"');
  });

});
