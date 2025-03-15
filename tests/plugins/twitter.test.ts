import { testPlugin } from '../utils';

describe('plugins / twitter', () => {

  it('should render an input field', () => {
    const content = `
    <p>foo<focus />bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="twitter" focus="end"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('twitter');
      },
    );
  });

  it('should render a tweet', () => {
    const content = `
    <p>foo<focus />bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="twitter" value="eyJ1cmwiOiJodHRwczovL3guY29tL1N1cHBvcnQvc3RhdHVzLzExNDEwMzk4NDE5OTMzNTUyNjQifQ==" focus="end"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('twitter', {
          url: 'https://x.com/Support/status/1141039841993355264',
        });
      },
    );
  });

});
