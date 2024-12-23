import { template } from '../../src/utils/template';

describe('utils / template', () => {

  it('should escape special characters', () => {
    const name = '<foo="bar">';
    const age = 40;
    const content = template`<p>${name}</p><p>${age}</p>`;
    expect(content).to.equal('<p>&lt;foo=&quot;bar&quot;&gt;</p><p>40</p>');
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
