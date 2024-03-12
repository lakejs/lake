import { expect } from 'chai';
import { testBox } from '../utils';

describe('boxes / code-block', () => {

  it('renders box', () => {
    testBox('codeBlock', {
      code: 'function foo() {\n\n}',
    }, box => {
      expect(box.name).to.equal('codeBlock');
    });
  });

});
