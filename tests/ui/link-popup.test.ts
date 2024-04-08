import { click } from '../utils';
import { query } from '../../src/utils';
import { LinkPopup } from '../../src/ui/link-popup';
import { Nodes } from '../../src';

describe('ui / link-popup', () => {

  let rootNode: Nodes;

  beforeEach(()=> {
    rootNode = query('<div class="lake-popup lake-custom-properties" />');
    query(document.body).append(rootNode);
  });

  afterEach(() => {
    rootNode.remove();
  });

  it('should copy a link to clipboard', done => {
    const linkNode = query('<a href="http://github.com/">GitHub</a>');
    query(document.body).append(linkNode);
    const popup = new LinkPopup(rootNode);
    const copyButton = popup.container.find('button[name="copy"]');
    popup.event.on('copy', error => {
      if (error) {
        expect(copyButton.find('svg').eq(0).computedCSS('display')).to.equal('none');
        expect(copyButton.find('svg').eq(2).computedCSS('display')).to.equal('inline');
        done();
        return;
      }
      expect(copyButton.find('svg').eq(0).computedCSS('display')).to.equal('none');
      expect(copyButton.find('svg').eq(1).computedCSS('display')).to.equal('inline');
      done();
    });
    popup.show(linkNode);
    click(copyButton);
    linkNode.remove();
  });

});
