import { testBox } from '../utils';

describe('ui: boxes / code-block-ui', () => {

  it('codeBlock: JavaScript', () => {
    testBox('codeBlock', {
      lang: 'javascript',
      code: 'function foo() {\n\n}',
    }, box => {
      expect(box.name).to.equal('codeBlock');
    });
  });

  it('codeBlock: error status', () => {
    const CodeMirror = window.CodeMirror;
    window.CodeMirror = undefined;
    testBox('codeBlock', {
      lang: 'javascript',
      code: 'function foo() {\n\n}',
    }, box => {
      expect(box.name).to.equal('codeBlock');
      window.CodeMirror = CodeMirror;
    });
  });

});
