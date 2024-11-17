import { query } from '../../src/utils/query';
import { LinkPopup } from '../../src/ui/link-popup';

describe('ui / link-popup-ui', () => {

  it('link popup', () => {
    const linkNode = query('<a href="http://github.com/" class="lake-ui-test">GitHub</a>');
    query(document.body).append(linkNode);
    const popup = new LinkPopup();
    popup.container.addClass('lake-ui-test');
    popup.show(linkNode);
    expect(popup.visible).to.equal(true);
  });

});
