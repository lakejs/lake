import { testPlugin } from '../utils';

describe('backspace plugin', () => {

  it('no content', () => {
    const content = `
    <focus />
    `;
    const output = `
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('paragraph', () => {
    const content = `
    <p><br /><focus /></p>
    `;
    const output = `
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });


  it('sets heading to paragraph', () => {
    const content = `
    <h1><br /><focus /></h1>
    `;
    const output = `
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('merges empty paragraphs', () => {
    const content = `
    <p><br /></p>
    <p><br /><focus /></p>
    `;
    const output = `
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('merges paragraph into heading', () => {
    const content = `
    <h1>foo</h1>
    <p><focus />bar</p>
    `;
    const output = `
    <h1>foo<focus />bar</h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('merges empty paragraph into heading', () => {
    const content = `
    <h1>foo</h1>
    <p><br /><focus /></p>
    `;
    const output = `
    <h1>foo<focus /></h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should remove figure before paragraph', () => {
    const content = `
    <figure type="block" name="hr"><span class="figure-left"><br /></span><div class="figure-body" contenteditable="false"><hr /></div><span class="figure-right"><br /></span></figure>
    <p><focus />foo</p>
    `;
    const output = `
    <p><br /><focus /></p>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should remove empty paragraph before figure', () => {
    const content = `
    <p><br /></p>
    <figure type="block" name="hr"><span class="figure-left"><br /></span><div class="figure-body" contenteditable="false"><hr /></div><span class="figure-right"><br /></span></figure>
    `;
    const output = `
    <figure type="block" name="hr"></figure>
    `;
    testPlugin(
      content,
      output,
      editor => {
        const range = editor.selection.range;
        range.selectNodeContents(editor.container.find('.figure-left'));
        range.collapseToEnd();
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should move cursor with paragraph before figure', () => {
    const content = `
    <p>foo</p>
    <figure type="block" name="hr"><span class="figure-left"><br /></span><div class="figure-body" contenteditable="false"><hr /></div><span class="figure-right"><br /></span></figure>
    `;
    const output = `
    <p>foo<focus /></p>
    <figure type="block" name="hr"></figure>
    `;
    testPlugin(
      content,
      output,
      editor => {
        const range = editor.selection.range;
        range.selectNodeContents(editor.container.find('.figure-left'));
        range.collapseToEnd();
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should remove figure with selecting the end of figure', () => {
    const content = `
    <p>foo</p>
    <figure type="block" name="hr"><span class="figure-left"><br /></span><div class="figure-body" contenteditable="false"><hr /></div><span class="figure-right"><br /></span></figure>
    `;
    const output = `
    <p>foo</p>
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        const range = editor.selection.range;
        range.selectNodeContents(editor.container.find('.figure-right'));
        range.collapseToEnd();
        editor.keystroke.keydown('backspace');
      },
    );
  });

});
