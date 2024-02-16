import { testPlugin } from '../utils';

const imageUrl = './data/cow.jpg';
const imageBoxValue = 'eyJ1cmwiOiIuL2RhdGEvY293LmpwZyJ9';

describe('plugin / image', () => {

  it('inserts an image box', () => {
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

});
