import { expect } from 'chai';
import { template } from '../../src/utils';

describe('utils / template', () => {

  it('should return template', () => {
    const content = `
    <div>
      <div>foo</div>
      <div>
        bar
      </div>
    </div>
    `;
    expect(template(content)).to.equal('<div><div>foo</div><div>bar</div></div>');
  });

});
