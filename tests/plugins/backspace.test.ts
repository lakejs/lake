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

  it('should remove box before paragraph', () => {
    const content = `
    <lake-box type="block" name="hr"><span class="box-strip"><br /></span><div class="box-body" contenteditable="false"><hr /></div><span class="box-strip"><br /></span></lake-box>
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

  it('should remove empty paragraph before box', () => {
    const content = `
    <p><br /></p>
    <lake-box type="block" name="hr"><span class="box-strip"><br /></span><div class="box-body" contenteditable="false"><hr /></div><span class="box-strip"><br /></span></lake-box>
    `;
    const output = `
    <lake-box type="block" name="hr"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        const range = editor.selection.range;
        range.selectNodeContents(editor.container.find('.box-strip'));
        range.collapseToEnd();
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should move cursor with paragraph before box', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr"><span class="box-strip"><br /></span><div class="box-body" contenteditable="false"><hr /></div><span class="box-strip"><br /></span></lake-box>
    `;
    const output = `
    <p>foo<focus /></p>
    <lake-box type="block" name="hr"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        const range = editor.selection.range;
        range.selectNodeContents(editor.container.find('.box-strip').eq(0));
        range.collapseToEnd();
        editor.keystroke.keydown('backspace');
      },
    );
  });

  it('should remove box with selecting the end of box', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr"><span class="box-strip"><br /></span><div class="box-body" contenteditable="false"><hr /></div><span class="box-strip"><br /></span></lake-box>
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
        range.selectNodeContents(editor.container.find('.box-strip').eq(1));
        range.collapseToEnd();
        editor.keystroke.keydown('backspace');
      },
    );
  });

});
