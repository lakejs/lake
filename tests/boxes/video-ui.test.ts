import { showBox } from '../utils';

describe('boxes / video-ui', () => {

  it('video (editable)', () => {
    showBox('video', undefined, box => {
      expect(box.name).to.equal('video');
    });
  });

  it('video (read-only)', () => {
    showBox('video', undefined, box => {
      expect(box.name).to.equal('video');
    }, true);
  });

});
