import { testPlugin } from '../../utils';

const mediaUrl = '../assets/files/flower.mp4';
const mediaBoxValue = 'eyJ1cmwiOiIuLi9hc3NldHMvZmlsZXMvZmxvd2VyLm1wNCIsInN0YXR1cyI6ImRvbmUifQ==';

describe('plugins / media / index', () => {

  it('should return correct config', () => {
    testPlugin(
      '',
      '',
      editor => {
        expect(editor.config.media.requestMethod).to.equal('POST');
        expect(editor.config.media.requestTypes[0]).to.deep.equal('video/mp4');
      },
    );
  });

  it('should insert a media', () => {
    const content = `
    <p>foo<focus />bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="media" value="${mediaBoxValue}" focus="end"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('media', {
          url: mediaUrl,
          status: 'done',
        });
      },
    );
  });

});
