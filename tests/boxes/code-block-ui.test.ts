import { testBox } from '../utils';

describe('ui: boxes / code-block-ui', () => {

  it('codeBlock', () => {
    testBox('codeBlock', {
      lang: 'javascript',
      code: 'function foo() {\n\n}',
    }, box => {
      expect(box.name).to.equal('codeBlock');
    });
  });

});
