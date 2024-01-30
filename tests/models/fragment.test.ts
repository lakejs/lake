import { expect } from 'chai';
import { query } from '../../src/utils';
import { Fragment } from '../../src/models/fragment';

describe('models / fragment', () => {

  it('method: find', () => {
    const nativeFragment = document.createDocumentFragment();
    nativeFragment.appendChild(query('<div>foo</div>').get(0));
    nativeFragment.appendChild(query('<div><strong>bar</strong></div>').get(0));
    expect(new Fragment(nativeFragment).find('div').length).to.equal(2);
    expect(new Fragment(nativeFragment).find('strong').length).to.equal(1);
  });

  it('method: append', () => {
    const fragment = new Fragment();
    fragment.append(query('<div>foo</div><div><strong>bar</strong></div>'));
    expect(fragment.find('div').length).to.equal(2);
    expect(fragment.find('strong').length).to.equal(1);
  });

});
