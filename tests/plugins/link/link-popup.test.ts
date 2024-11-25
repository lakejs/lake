import { query } from 'lakelib/utils/query';
import { LinkPopup } from 'lakelib/plugins/link/link-popup';
import { click } from '../../utils';

describe('plugins / link / link-popup', () => {

  it('should copy a link to clipboard', done => {
    const linkNode = query('<a href="http://github.com/">GitHub</a>');
    query(document.body).append(linkNode);
    const popup = new LinkPopup({
      onCopy: error => {
        const copyButton = popup.container.find('button[name="copy"]');
        if (!error) {
          expect(copyButton.find('svg').eq(0).computedCSS('display')).to.equal('none');
          expect(copyButton.find('svg').eq(1).computedCSS('display')).to.equal('inline');
          popup.unmount();
          linkNode.remove();
          done();
        }
      },
    });
    popup.show(linkNode);
    click(popup.container.find('button[name="copy"]'));
  });

  it('should not copy a link to clipboard', done => {
    window.LAKE_ERROR = true;
    const linkNode = query('<a href="http://github.com/">GitHub</a>');
    query(document.body).append(linkNode);
    const popup = new LinkPopup({
      onCopy: error => {
        const copyButton = popup.container.find('button[name="copy"]');
        if (error) {
          expect(copyButton.find('svg').eq(0).computedCSS('display')).to.equal('none');
          expect(copyButton.find('svg').eq(2).computedCSS('display')).to.equal('inline');
          window.LAKE_ERROR = false;
          popup.unmount();
          linkNode.remove();
          done();
        }
      },
    });
    popup.show(linkNode);
    click(popup.container.find('button[name="copy"]'));
  });

  it('should save the URL and title by clicking button', () => {
    const linkNode = query('<a href="http://github.com/">GitHub</a>');
    query(document.body).append(linkNode);
    const popup = new LinkPopup();
    popup.show(linkNode);
    popup.container.find('input[name="url"]').value('http://foo.com/');
    popup.container.find('input[name="title"]').value('foo');
    const saveButton = popup.container.find('button[name="save"]');
    click(saveButton);
    expect(linkNode.attr('href')).to.equal('http://foo.com/');
    expect(linkNode.text()).to.equal('foo');
    popup.unmount();
    linkNode.remove();
  });

  it('should save the URL by pressing enter key', () => {
    const linkNode = query('<a href="http://github.com/">GitHub</a>');
    query(document.body).append(linkNode);
    const popup = new LinkPopup();
    popup.show(linkNode);
    popup.container.find('input[name="url"]').value('http://foo.com/');
    popup.container.find('input[name="url"]').emit('keydown', new KeyboardEvent('keydown', {
      key: 'Enter',
    }));
    expect(linkNode.attr('href')).to.equal('http://foo.com/');
    expect(linkNode.text()).to.equal('GitHub');
    popup.unmount();
    linkNode.remove();
  });

  it('should save the title by pressing enter key', () => {
    const linkNode = query('<a href="http://github.com/">GitHub</a>');
    query(document.body).append(linkNode);
    const popup = new LinkPopup();
    popup.show(linkNode);
    popup.container.find('input[name="title"]').value('foo');
    popup.container.find('input[name="url"]').emit('keydown', new KeyboardEvent('keydown', {
      key: 'Enter',
    }));
    expect(linkNode.attr('href')).to.equal('http://github.com/');
    expect(linkNode.text()).to.equal('foo');
    popup.unmount();
    linkNode.remove();
  });

  it('title should use URL when title is empty', () => {
    const linkNode = query('<a href="http://github.com/">GitHub</a>');
    query(document.body).append(linkNode);
    const popup = new LinkPopup();
    popup.show(linkNode);
    popup.container.find('input[name="title"]').value('');
    const saveButton = popup.container.find('button[name="save"]');
    click(saveButton);
    expect(linkNode.text()).to.equal('http://github.com/');
    popup.unmount();
    linkNode.remove();
  });

  it('title should not display URL when title and URL are equal', () => {
    const linkNode = query('<a href="http://github.com/">http://github.com/</a>');
    query(document.body).append(linkNode);
    const popup = new LinkPopup();
    popup.show(linkNode);
    expect(popup.container.find('input[name="title"]').value()).to.equal('');
    popup.unmount();
    linkNode.remove();
  });

  it('should remove link when both URL and title are empty', () => {
    const linkNode = query('<a href="http://github.com/">GitHub</a>');
    query(document.body).append(linkNode);
    const popup = new LinkPopup();
    popup.show(linkNode);
    popup.container.find('input[name="url"]').value('');
    popup.container.find('input[name="title"]').value('');
    const saveButton = popup.container.find('button[name="save"]');
    click(saveButton);
    expect(linkNode.parent().length).to.equal(0);
    popup.unmount();
    linkNode.remove();
  });

});
