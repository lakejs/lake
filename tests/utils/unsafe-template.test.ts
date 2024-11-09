import { unsafeTemplate } from '../../src/utils';

describe('utils / unsafe-template', () => {

  it('should not escape special characters', () => {
    const name = '<span>foo</span>';
    const age = 40;
    const content = unsafeTemplate`<p>${name}</p><p>${age}</p>`;
    expect(content).to.equal('<p><span>foo</span></p><p>40</p>');
  });

  it('should remove empty spaces', () => {
    const content = unsafeTemplate`
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
