import { boxes } from '@/storage/boxes';
import { getBox } from '@/utils/get-box';
import { insertLink } from '@/plugins/link/insert-link';
import { testOperation } from '../../utils';

describe('plugins / link / insert-link', () => {

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

  it('insertLink: should remove br tag', () => {
    const content = `
    <p><br /><focus /></p>
    `;
    const output = `
    <p><a href="http://foo.com/">foo</a><focus /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertLink(range, '<a href="http://foo.com/">foo</a>');
      },
    );
  });

  it('insertLink: should add a link after selecting text', () => {
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

  it('insertLink: should update url when the cursor is in the link', () => {
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

  it('insertLink: should not update url with empty href', () => {
    const content = `
    <p>f<a href="http://foo.com/" target="_blank">o<focus />o</a>bar</p>
    `;
    const output = `
    <p>f<a href="http://foo.com/" target="_blank">o<focus />o</a>bar</p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertLink(range, '<a href="">New link</a>');
      },
    );
  });

  it('insertLink: should add a link when selecting another link with text', () => {
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

  it('insertLink: should add a link after selecting marks', () => {
    const content = `
    <p><anchor />one<strong>two</strong><u>three</u><i><s>four</s></i><focus /></p>
    `;
    const output = `
    <p><anchor /><a href="http://foo.com/" download="true">one<strong>two</strong><u>three</u><i><s>four</s></i></a><focus /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertLink(range, '<a href="http://foo.com/" download="true" />');
      },
    );
  });

  it('insertLink: should add a link when the selection is astride a link', () => {
    const content = `
    <p><anchor />foo<a href="http://foo.com/">ba<focus />r</a></p>
    `;
    const output = `
    <p><anchor /><a href="http://bar.com/">fooba</a><focus /><a href="http://foo.com/">r</a></p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertLink(range, '<a href="http://bar.com/" />');
      },
    );
  });

  it('insertLink: should add a link when the selection is astride a block', () => {
    const content = `
    <p><anchor /><i>foo</i></p>
    <p>one<strong>two</strong>three</p>
    <p>bar<focus /></p>
    `;
    const output = `
    <p><anchor /><a href="http://foo.com/"><i>foo</i></a></p>
    <p>one<strong>two</strong>three</p>
    <p>bar<focus /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        insertLink(range, '<a href="http://foo.com/" />');
      },
    );
  });

  it('insertLink: should not add a link after selecting content with box', () => {
    const content = `
    <p><focus />foo</p>
    <lake-box type="block" name="blockBox"></lake-box>
    <p><lake-box type="inline" name="inlineBox"></lake-box>bar</p>
    `;
    const output = `
    <p>foo</p>
    <anchor /><lake-box type="block" name="blockBox"></lake-box>
    <p><lake-box type="inline" name="inlineBox"></lake-box>bar<focus /></p>
    `;
    testOperation(
      content,
      output,
      range => {
        const container = range.startNode.closestContainer();
        const boxNode = container.find('lake-box').eq(0);
        const box = getBox(boxNode);
        box.render();
        range.selectBoxStart(boxNode);
        range.setEnd(container.find('p').eq(1), 2);
        insertLink(range, '<a href="http://foo.com/" />');
      },
    );
  });

});
