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

});
