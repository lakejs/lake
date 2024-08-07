import { query } from '../../src/utils';
import { LinkPopup } from '../../src/ui/link-popup';

describe('ui / link-popup-ui', () => {

  it('link popup', () => {
    const container = query('<div class="lake-popup lake-custom-properties" />');
    const linkNode = query('<a href="http://github.com/">GitHub</a>');
    query(document.body).append(container);
    query(document.body).append(linkNode);
    const popup = new LinkPopup({
      root: container,
    });
    popup.show(linkNode);
    expect(container.find('.lake-link-popup').length).to.equal(1);
  });

});
