import { showBox } from '../../utils';

describe('plugins/ hr / hr-box-ui', () => {

  it('hr (editable)', () => {
    showBox('hr', undefined, box => {
      expect(box.name).to.equal('hr');
    });
  });

  it('hr (read-only)', () => {
    showBox('hr', undefined, box => {
      expect(box.name).to.equal('hr');
    }, true);
  });

});
