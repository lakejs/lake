import { testPlugin } from '../utils';

const imageUrl = './data/cow.jpg';
const imageBoxValue = 'eyJ1cmwiOiIuL2RhdGEvY293LmpwZyJ9';

describe('plugin / image', () => {

  it('inserts into text', () => {
    const content = `
    <p>foo<focus />bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="right"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('image', imageUrl);
      },
    );
  });

  it('inserts into right strip of box', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="right"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box><lake-box type="inline" name="image" value="${imageBoxValue}" focus="right"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('image', imageUrl);
      },
    );
  });

  it('inserts into left strip of box', () => {
    const content = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="left"></lake-box>bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="right"></lake-box><lake-box type="inline" name="image" value="${imageBoxValue}"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('image', imageUrl);
      },
    );
  });

});
