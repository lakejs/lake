import { expect } from 'chai';
import { template } from '../../src/utils';

describe('utils / template', () => {

  it('should not escape special characters', () => {
    const name = '<span>foo</span>';
    const age = 40;
    const content = template`<p>${name}</p><p>${age}</p>`;
    expect(content).to.equal('<p><span>foo</span></p><p>40</p>');
  });

  it('should remove empty spaces', () => {
    const content = template`
    <div>
      <div>foo</div>
      <div>
        bar
      </div>
    </div>
    `;
    expect(content).to.equal('<div><div>foo</div><div>bar</div></div>');
  });

});
