import { parseStyle } from '../../src/utils/parse-style';

describe('utils / parse-style', () => {

  it('parses style string', () => {
    const properties = parseStyle('color: red; border: 1px solid #ccc; margin-right: 10px;');
    expect(properties.color).to.equal('red');
    expect(properties.border).to.equal('1px solid #ccc');
    expect(properties['margin-right']).to.equal('10px');
  });

  it('parses style with fonts', () => {
    const properties = parseStyle('color: red; font-family: -apple-system, BlinkMacSystemFont, &quot;segoe ui&quot;; margin-right: 10px;');
    expect(properties.color).to.equal('red');
    expect(properties['font-family']).to.equal('-apple-system, BlinkMacSystemFont, "segoe ui"');
    expect(properties['margin-right']).to.equal('10px');
  });

});
