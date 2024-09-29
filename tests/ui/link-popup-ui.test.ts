import { query } from '../../src/utils';
import { LinkPopup } from '../../src/ui/link-popup';

describe('ui / link-popup-ui', () => {

  it('link popup', () => {
    const linkNode = query('<a href="http://github.com/">GitHub</a>');
    query(document.body).append(linkNode);
    const popup = new LinkPopup();
    popup.show(linkNode);
    expect(popup.visible).to.equal(true);
  });

});
