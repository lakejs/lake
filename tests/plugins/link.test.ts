import { testPlugin } from '../utils';

describe('plugin / link', () => {

  it('adds a link after selecting text', () => {
    const content = `
    <p>f<anchor />oo<focus />bar</p>
    `;
    const output = `
    <p>f<anchor /><a href="http://foo.com/" target="_blank">oo</a><focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('link', 'http://foo.com/');
      },
    );
  });

  it('updates url when the cursor is on the link', () => {
    const content = `
    <p>f<a href="http://foo.com/" target="_blank">o<focus />o</a>bar</p>
    `;
    const output = `
    <p>f<a href="http://bar.com/" target="_self">o<focus />o</a>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('link', 'http://bar.com/', '_self');
      },
    );
  });

  it('adds a link when selecting part of another link', () => {
    const content = `
    <p><a href="http://foo.com/" target="_blank">foo<anchor />bar<focus /></a></p>
    `;
    const output = `
    <p><a href="http://foo.com/" target="_blank">foo</a><anchor /><a href="http://bar.com/" target="_blank">bar</a><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('link', 'http://bar.com/');
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
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('link', 'http://bar.com/');
      },
    );
  });

});
