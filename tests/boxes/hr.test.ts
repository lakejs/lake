import { testBox } from '../utils';

describe('boxes / hr', () => {

  it('renders box', () => {
    testBox('hr', undefined, box => {
      expect(box.name).to.equal('hr');
    });
  });

  it('activates box', () => {
    testBox('hr', undefined, box => {
      box.getContainer().emit('click');
      expect(box.name).to.equal('hr');
    });
  });

});
