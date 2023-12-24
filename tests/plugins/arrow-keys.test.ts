import { testPlugin } from '../utils';

const imageBoxValue = 'eyJ1cmwiOiIuL2RhdGEvY293LmpwZyJ9';

describe('plugin / arrow-keys', () => {

  it('left key: cursor is on the left strip of the box', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="left"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<focus /><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-left');
      },
    );
  });

  it('left key: cursor is on the right strip of the box', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="right"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-left');
      },
    );
  });

  it('left key: box is selected', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="left"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-left');
      },
    );
  });

  it('left key: cursor is outside the end of the box', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box><focus />bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-left');
      },
    );
  });

  it('right key: cursor is on the left strip of the box', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="left"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-right');
      },
    );
  });

  it('right key: box is selected', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="right"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-right');
      },
    );
  });

  it('right key: cursor is on the right strip of the box', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="right"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box><focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-right');
      },
    );
  });

  it('right key: cursor is outside the start of the box', () => {
    const content = `
    <p>foo<focus /><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="center"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('arrow-right');
      },
    );
  });

});
