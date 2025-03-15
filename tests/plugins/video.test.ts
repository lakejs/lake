import { testPlugin } from '../utils';

describe('plugins / video', () => {

  it('should render an input field', () => {
    const content = `
    <p>foo<focus />bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="video" focus="end"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('video');
      },
    );
  });

  it('should render a video', () => {
    const content = `
    <p>foo<focus />bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="video" value="eyJ1cmwiOiJodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PTVzTUJoRHY0c2lrIn0=" focus="end"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('video', {
          url: 'https://www.youtube.com/watch?v=5sMBhDv4sik',
        });
      },
    );
  });

});
