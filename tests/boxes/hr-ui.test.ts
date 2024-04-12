import { testBox } from '../utils';

describe('boxes / hr-ui', () => {

  it('hr', () => {
    testBox('hr', undefined, box => {
      expect(box.name).to.equal('hr');
    });
  });

});
