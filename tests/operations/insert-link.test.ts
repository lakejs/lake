import { boxes } from '../../src/storage/boxes';
import { testOperation } from '../utils';
import { insertLink } from '../../src/operations/insert-link';

describe('operations / insert-link', () => {

  beforeEach(() => {
    boxes.set('inlineBox', {
      type: 'inline',
      name: 'inlineBox',
      render: () => '<img />',
    });
    boxes.set('blockBox', {
      type: 'block',
      name: 'blockBox',
      render: () => '<hr />',
    });
  });

  afterEach(() => {
    boxes.delete('inlineBox');
    boxes.delete('blockBox');
  });

  it('adds a link after selecting text', () => {
    const content = `
    <p>f<anchor />oo<focus />bar</p>
    `;
    const output = `
    <p>f<anchor /><a href="http://foo.com/" target="_blank">oo</a><focus />bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertLink(range, '<a href="http://foo.com/" target="_blank" />');
      },
    );
  });

  it('updates url when the cursor is on the link', () => {
    const content = `
    <p>f<a href="http://foo.com/" target="_blank">o<focus />o</a>bar</p>
    `;
    const output = `
    <p>f<a href="http://bar.com/" target="_blank">o<focus />o</a>bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertLink(range, '<a href="http://bar.com/" target="_blank" />');
      },
    );
  });

  it('adds a link when selecting another link with text', () => {
    const content = `
    <p><anchor /><a href="http://foo.com/" target="_blank">foo</a>bar<focus /></p>
    `;
    const output = `
    <p><anchor /><a href="http://bar.com/" target="_blank">foobar</a><focus /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertLink(range, '<a href="http://bar.com/" target="_blank" />');
      },
    );
  });

});
