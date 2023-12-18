import { testPlugin } from '../utils';

describe('plugin / enter-key', () => {

  it('paragraph: empty content', () => {
    const content = `
    <p><br /><focus /></p>
    `;
    const output = `
    <p><br /></p>
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('paragraph: the focus is between the characters of the text', () => {
    const content = `
    <p>f<focus />oo</p>
    `;
    const output = `
    <p>f</p>
    <p><focus />oo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('paragraph: the focus is at the beginning of the text', () => {
    const content = `
    <p><focus />foo</p>
    `;
    const output = `
    <p><br /></p>
    <p><focus />foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('paragraph: the focus is at the end of the text', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo</p>
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('paragraph: should create a new block when there is no closest block', () => {
    const content = `
    foo<focus />bar
    `;
    const output = `
    <p>foo</p>
    <p><focus />bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('heading: should become paragraph when the focus is at the end of the heading', () => {
    const content = `
    <h1>foo<focus /></h1>
    `;
    const output = `
    <h1>foo</h1>
    <p><focus /><br /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('heading: should not become paragraph when the focus is at the beginning of the heading', () => {
    const content = `
    <h1><focus />foo</h1>
    `;
    const output = `
    <h1><br /></h1>
    <h1><focus />foo</h1>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('list: the focus is between the characters of the text', () => {
    const content = `
    <ul><li>f<focus />oo</li></ul>
    `;
    const output = `
    <ul><li>f</li></ul>
    <ul><li><focus />oo</li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('list: empty content', () => {
    const content = `
    <ul><li>foo</li></ul>
    <ul><li><br /><focus /></li></ul>
    `;
    const output = `
    <ul><li>foo</li></ul>
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('list: should keep correct number', () => {
    const content = `
    <ol start="1"><li>f<focus />oo</li></ol>
    `;
    const output = `
    <ol start="1"><li>f</li></ol>
    <ol start="2"><li><focus />oo</li></ol>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('checklist: the focus is at the end of the text', () => {
    const content = `
    <ul type="checklist"><li value="true">foo<focus /></li></ul>
    `;
    const output = `
    <ul type="checklist"><li value="true">foo</li></ul>
    <ul type="checklist"><li value="false"><focus /><br /></li></ul>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('box: the focus is at the beginning of the box', () => {
    const content = `
    <lake-box type="block" name="hr" focus="left"></lake-box>
    `;
    const output = `
    <p><br /></p>
    <lake-box type="block" name="hr" focus="left"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('box: the focus is at the end of the box', () => {
    const content = `
    <lake-box type="block" name="hr" focus="right"></lake-box>
    `;
    const output = `
    <lake-box type="block" name="hr"></lake-box>
    <p><br /><focus /></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('box: the focus is outside the end of the box', () => {
    const content = `
    <lake-box type="block" name="hr"></lake-box><focus />
    <p>foo</p>
    `;
    const output = `
    <lake-box type="block" name="hr"></lake-box>
    <p><br /></p>
    <p><focus />foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

  it('box: the focus is in the box', () => {
    const content = `
    <lake-box type="block" name="hr" focus="center"></lake-box>
    <p>foo</p>
    `;
    const output = `
    <lake-box type="block" name="hr"></lake-box>
    <p><br /><focus /></p>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.keystroke.keydown('enter');
      },
    );
  });

});
