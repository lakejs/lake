import { showBox } from '../utils';

describe('boxes / hr-ui', () => {

  it('hr', () => {
    showBox('hr', undefined, box => {
      expect(box.name).to.equal('hr');
    });
  });

});
