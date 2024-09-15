import { showBox } from '../utils';

const mentionValue = {
  id: '1',
  name: 'luolonghao',
  nickname: 'Roddy',
  avatar: '<img src="../assets/images/universal-studios-240.jpg" />',
};

describe('boxes / mention-ui', () => {

  it('mention (editable)', () => {
    showBox('mention', mentionValue, box => {
      expect(box.name).to.equal('mention');
    });
  });

  it('mention (read-only)', () => {
    showBox('mention', mentionValue, box => {
      expect(box.name).to.equal('mention');
    }, true);
  });

});
