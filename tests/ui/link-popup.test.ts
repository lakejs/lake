import { click } from '../utils';
import { query } from '../../src/utils';
import { LinkPopup } from '../../src/ui/link-popup';

describe('ui: ui / link-popup', () => {

  it('should render popup', () => {
    const container = query('<div class="lake-popup lake-custom-properties" />');
    const linkNode = query('<a href="http://github.com/">GitHub</a>');
    query(document.body).append(container);
    query(document.body).append(linkNode);
    const popup = new LinkPopup(container);
    popup.show(linkNode);
    container.find('.lake-link-popup').css('position', 'static');
    expect(container.find('.lake-link-popup').length).to.equal(1);
  });

  it('should copy a link to clipboard', done => {
    const container = query('<div class="lake-popup lake-custom-properties" />');
    const linkNode = query('<a href="http://github.com/">GitHub</a>');
    query(document.body).append(container);
    query(document.body).append(linkNode);
    const popup = new LinkPopup(container);
    const copyButton = popup.container.find('button[name="copy"]');
    popup.event.on('copy', ()=> {
      expect(copyButton.find('svg').eq(0).computedCSS('display')).to.equal('none');
      expect(copyButton.find('svg').eq(1).computedCSS('display')).to.equal('inline');
      done();
    });
    popup.show(linkNode);
    click(copyButton);
    popup.container.remove();
  });

});
