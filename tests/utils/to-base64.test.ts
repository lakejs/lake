import { toBase64 } from '../../src/utils';

describe('utils / to-base64', () => {

  it('should encode a utf8 string to base64', () => {
    expect(toBase64('This is "测试字符串"')).to.equal('VGhpcyBpcyAi5rWL6K+V5a2X56ym5LiyIg==');
  });

});
