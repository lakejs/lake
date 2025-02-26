import { testPlugin } from '../../utils';

const fileUrl = '../assets/images/heaven-lake-256.png';
const fileBoxValue = 'eyJ1cmwiOiIuLi9hc3NldHMvaW1hZ2VzL2hlYXZlbi1sYWtlLTI1Ni5wbmciLCJzdGF0dXMiOiJkb25lIn0=';

describe('plugins / file / index', () => {

  it('should return correct config', () => {
    testPlugin(
      '',
      '',
      editor => {
        expect(editor.config.file.requestMethod).to.equal('POST');
        expect(editor.config.file.requestTypes[0]).to.deep.equal('application/zip');
      },
    );
  });

  it('should insert a file', () => {
    const content = `
    <p>foo<focus />bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="file" value="${fileBoxValue}" focus="end"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('file', {
          url: fileUrl,
          status: 'done',
        });
      },
    );
  });

});
