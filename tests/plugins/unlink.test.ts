import { testPlugin } from '../utils';

describe('plugin / unlink', () => {

  it('removes a link after selecting text', () => {
    const content = `
    <p>f<anchor /><a href="http://foo.com/" target="_blank">oo</a><focus />bar</p>
    `;
    const output = `
    <p>f<anchor />oo<focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('unlink');
      },
    );
  });

  it('removes a link when the cursor is on the link', () => {
    const content = `
    <p>f<a href="http://foo.com/" target="_blank">o<focus />o</a>bar</p>
    `;
    const output = `
    <p>fo<focus />obar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('unlink');
      },
    );
  });

  it('removes part of a link', () => {
    const content = `
    <p><a href="http://foo.com/" target="_blank">foo<anchor />bar<focus /></a></p>
    `;
    const output = `
    <p><a href="http://foo.com/" target="_blank">foo</a><anchor />bar<focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('unlink');
      },
    );
  });

  it('removes a link when selecting the link with text', () => {
    const content = `
    <p><anchor /><a href="http://foo.com/" target="_blank">foo</a>bar<focus /></p>
    `;
    const output = `
    <p><anchor />foobar<focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('unlink');
      },
    );
  });

});
