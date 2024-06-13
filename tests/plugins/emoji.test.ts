import { testPlugin } from '../utils';

const emojiValue = {
  url: '../assets/emojis/face_blowing_a_kiss_color.svg',
  title: 'Face blowing a kiss',
};

const rawValue = 'eyJ1cmwiOiIuLi9hc3NldHMvZW1vamlzL2ZhY2VfYmxvd2luZ19hX2tpc3NfY29sb3Iuc3ZnIiwidGl0bGUiOiJGYWNlIGJsb3dpbmcgYSBraXNzIn0=';

describe('plugins / emoji', () => {

  it('should insert an emoji', () => {
    const content = `
    <p>foo<focus />bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="emoji" value="${rawValue}" focus="end"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('emoji', emojiValue);
      },
    );
  });

});
