import { query } from '../../src/utils/query';
import { Fragment } from '../../src/models/fragment';

describe('models / fragment', () => {

  it('method: find', () => {
    const nativeFragment = document.createDocumentFragment();
    nativeFragment.appendChild(query('<div>foo</div>').get(0));
    nativeFragment.appendChild(query('<div><strong>bar</strong></div>').get(0));
    expect(new Fragment(nativeFragment).find('div').length).to.equal(2);
    expect(new Fragment(nativeFragment).find('strong').length).to.equal(1);
  });

  it('append method: string', () => {
    const fragment = new Fragment();
    fragment.append('<div>foo</div><div><strong>bar</strong></div>');
    expect(fragment.find('div').length).to.equal(2);
    expect(fragment.find('strong').length).to.equal(1);
  });

  it('append method: native node', () => {
    const fragment = new Fragment();
    const nodes = query('<div>foo</div><div><strong>bar</strong></div>');
    fragment.append(nodes.get(0));
    fragment.append(nodes.get(1));
    expect(fragment.find('div').length).to.equal(2);
    expect(fragment.find('strong').length).to.equal(1);
  });

  it('append method: nodes', () => {
    const fragment = new Fragment();
    fragment.append(query('<div>foo</div><div><strong>bar</strong></div>'));
    expect(fragment.find('div').length).to.equal(2);
    expect(fragment.find('strong').length).to.equal(1);
  });

});
