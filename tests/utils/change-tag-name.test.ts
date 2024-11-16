import { query } from '../../src/utils/query';
import { changeTagName } from '../../src/utils/change-tag-name';

describe('utils / change-tag-name', () => {

  it('should remove Zero-width spaces', () => {
    const container = query('<div><p id="test" style="text-align: center;">foo<i>bar</i></p></div>');
    changeTagName(container.find('p'), 'h1');
    expect(container.html()).to.equal('<h1 id="test" style="text-align: center;">foo<i>bar</i></h1>');
  });

});
