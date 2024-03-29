import { query } from '../../src/utils';
import { LinkPopup } from '../../src/ui/link-popup';

describe('ui: ui / link-popup', () => {

  it('renders popup', () => {
    const container = query('<div class="lake-popup lake-custom-properties" />');
    const linkNode = query('<a href="http://github.com/">GitHub</a>');
    query(document.body).append(container);
    query(document.body).append(linkNode);
    const popup = new LinkPopup(container);
    popup.show(linkNode);
    container.find('.lake-link-popup').css('position', 'static');
    expect(container.find('.lake-link-popup').length).to.equal(1);
  });

});
