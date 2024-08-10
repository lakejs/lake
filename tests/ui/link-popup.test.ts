import { click } from '../utils';
import { query } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { LinkPopup } from '../../src/ui/link-popup';

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
    const popup = new LinkPopup({
      root: rootNode,
      onCopy: error => {
        const copyButton = popup.container.find('button[name="copy"]');
        if (!error) {
          expect(copyButton.find('svg').eq(0).computedCSS('display')).to.equal('none');
          expect(copyButton.find('svg').eq(1).computedCSS('display')).to.equal('inline');
          done();
        }
      },
    });
    popup.show(linkNode);
    click(popup.container.find('button[name="copy"]'));
    linkNode.remove();
  });

  it('should not copy a link to clipboard', done => {
    window.LAKE_ERROR = true;
    const linkNode = query('<a href="http://github.com/">GitHub</a>');
    query(document.body).append(linkNode);
    const popup = new LinkPopup({
      root: rootNode,
      onCopy: error => {
        const copyButton = popup.container.find('button[name="copy"]');
        if (error) {
          expect(copyButton.find('svg').eq(0).computedCSS('display')).to.equal('none');
          expect(copyButton.find('svg').eq(2).computedCSS('display')).to.equal('inline');
          window.LAKE_ERROR = false;
          done();
        }
      },
    });
    popup.show(linkNode);
    click(popup.container.find('button[name="copy"]'));
    linkNode.remove();
  });

  it('should save the URL and title by clicking button', () => {
    const linkNode = query('<a href="http://github.com/">GitHub</a>');
    query(document.body).append(linkNode);
    const popup = new LinkPopup({
      root: rootNode,
    });
    popup.show(linkNode);
    popup.setInputValue('url', 'http://foo.com/');
    popup.setInputValue('title', 'foo');
    const saveButton = popup.container.find('button[name="save"]');
    click(saveButton);
    expect(linkNode.attr('href')).to.equal('http://foo.com/');
    expect(linkNode.text()).to.equal('foo');
    linkNode.remove();
  });

  it('should save the URL by pressing enter key', () => {
    const linkNode = query('<a href="http://github.com/">GitHub</a>');
    query(document.body).append(linkNode);
    const popup = new LinkPopup({
      root: rootNode,
    });
    popup.show(linkNode);
    popup.setInputValue('url', 'http://foo.com/');
    popup.container.find('input[name="url"]').emit('keydown', new KeyboardEvent('keydown', {
      key: 'Enter',
    }));
    expect(linkNode.attr('href')).to.equal('http://foo.com/');
    expect(linkNode.text()).to.equal('GitHub');
    linkNode.remove();
  });

  it('should save the title by pressing enter key', () => {
    const linkNode = query('<a href="http://github.com/">GitHub</a>');
    query(document.body).append(linkNode);
    const popup = new LinkPopup({
      root: rootNode,
    });
    popup.show(linkNode);
    popup.setInputValue('title', 'foo');
    popup.container.find('input[name="url"]').emit('keydown', new KeyboardEvent('keydown', {
      key: 'Enter',
    }));
    expect(linkNode.attr('href')).to.equal('http://github.com/');
    expect(linkNode.text()).to.equal('foo');
    linkNode.remove();
  });

  it('title should use URL when title is empty', () => {
    const linkNode = query('<a href="http://github.com/">GitHub</a>');
    query(document.body).append(linkNode);
    const popup = new LinkPopup({
      root: rootNode,
    });
    popup.show(linkNode);
    popup.setInputValue('title', '');
    const saveButton = popup.container.find('button[name="save"]');
    click(saveButton);
    expect(linkNode.text()).to.equal('http://github.com/');
    linkNode.remove();
  });

  it('title should not display URL when title and URL are equal', () => {
    const linkNode = query('<a href="http://github.com/">http://github.com/</a>');
    query(document.body).append(linkNode);
    const popup = new LinkPopup({
      root: rootNode,
    });
    popup.show(linkNode);
    expect(popup.getInputValue('title')).to.equal('');
    linkNode.remove();
  });

  it('should remove link when both URL and title are empty', () => {
    const linkNode = query('<a href="http://github.com/">GitHub</a>');
    query(document.body).append(linkNode);
    const popup = new LinkPopup({
      root: rootNode,
    });
    popup.show(linkNode);
    popup.setInputValue('url', '');
    popup.setInputValue('title', '');
    const saveButton = popup.container.find('button[name="save"]');
    click(saveButton);
    expect(linkNode.parent().length).to.equal(0);
    linkNode.remove();
  });

});
