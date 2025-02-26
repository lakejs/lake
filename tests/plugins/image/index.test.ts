import { testPlugin } from '../../utils';

const imageUrl = '../assets/images/heaven-lake-256.png';
const imageBoxValue = 'eyJ1cmwiOiIuLi9hc3NldHMvaW1hZ2VzL2hlYXZlbi1sYWtlLTI1Ni5wbmciLCJzdGF0dXMiOiJkb25lIn0=';

describe('plugins / image / index', () => {

  it('should return correct config', () => {
    testPlugin(
      '',
      '',
      editor => {
        expect(editor.config.image.requestMethod).to.equal('POST');
        expect(editor.config.image.requestTypes[0]).to.deep.equal('image/gif');
      },
    );
  });

  it('should insert an image', () => {
    const content = `
    <p>foo<focus />bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="end"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('image', {
          url: imageUrl,
          status: 'done',
        });
      },
    );
  });

});
