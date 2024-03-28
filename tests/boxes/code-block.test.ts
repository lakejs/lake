import { testBox } from '../utils';

describe('ui: boxes / code-block', () => {

  it('renders box', () => {
    testBox('codeBlock', {
      code: 'function foo() {\n\n}',
    }, box => {
      expect(box.name).to.equal('codeBlock');
    });
  });

});
