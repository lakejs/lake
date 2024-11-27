import { showBox } from '../../utils';

const emojiValue = {
  url: '../assets/emojis/face_blowing_a_kiss_color.svg',
  title: 'Face blowing a kiss',
};

describe('plugins / emoji / emoji-box-ui', () => {

  it('emoji (editable)', () => {
    showBox('emoji', emojiValue, box => {
      expect(box.name).to.equal('emoji');
    });
  });

  it('emoji (read-only)', () => {
    showBox('emoji', emojiValue, box => {
      expect(box.name).to.equal('emoji');
    }, true);
  });

});
