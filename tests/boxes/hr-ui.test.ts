import { showBox } from '../utils';

describe('boxes / hr-ui', () => {

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
