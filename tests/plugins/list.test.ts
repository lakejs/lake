import { testPlugin } from '../utils';

// const imageUrl = '../assets/images/heaven-lake-256.png';
const imageBoxValue = 'eyJ1cmwiOiIuLi9hc3NldHMvaW1hZ2VzL2hlYXZlbi1sYWtlLTI1Ni5wbmciLCJzdGF0dXMiOiJkb25lIn0=';

describe('plugins / list', () => {

  it('should change a paragraph to a numbered list', () => {
    const content = `
    <p>numbered list<focus /></p>
    <p>foo</p>
    `;
    const output = `
    <ol start="1"><li>numbered list<focus /></li></ol>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'numbered');
      },
    );
  });

  it('should change a paragraph to a bulleted list', () => {
    const content = `
    <p>bulleted list<focus /></p>
    <p>foo</p>
    `;
    const output = `
    <ul><li>bulleted list<focus /></li></ul>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'bulleted');
      },
    );
  });

  it('should change a paragraph to a checklist', () => {
    const content = `
    <p>foo<focus /></p>
    <p>bar</p>
    `;
    const output = `
    <ul type="checklist"><li value="false">foo<focus /></li></ul>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'checklist');
      },
    );
  });

  it('should change a numbered list to a paragraph', () => {
    const content = `
    <ol><li>numbered list<focus /></li></ol>
    <p>foo</p>
    `;
    const output = `
    <p>numbered list<focus /></p>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'numbered');
      },
    );
  });

  it('should change a numbered list to a bulleted list', () => {
    const content = `
    <ol><li>foo<focus /></li></ol>
    <p>bar</p>
    `;
    const output = `
    <ul><li>foo<focus /></li></ul>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'bulleted');
      },
    );
  });

  it('should change a numbered list that includes an inline box to a bulleted list', () => {
    const content = `
    <ol><li>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="end"></lake-box></li></ol>
    <p>bar</p>
    `;
    const output = `
    <ul><li>foo<lake-box type="inline" name="image" value="${imageBoxValue}" focus="end"></lake-box></li></ul>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'bulleted');
      },
    );
  });

  it('should change a numbered list to a checklist', () => {
    const content = `
    <ol><li>foo<focus /></li></ol>
    <p>bar</p>
    `;
    const output = `
    <ul type="checklist"><li value="false">foo<focus /></li></ul>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'checklist');
      },
    );
  });

  it('should change a bulleted list to a paragraph', () => {
    const content = `
    <ul><li>bulleted list<focus /></li></ul>
    <p>foo</p>
    `;
    const output = `
    <p>bulleted list<focus /></p>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'bulleted');
      },
    );
  });

  it('should change a bulleted list to a numbered list', () => {
    const content = `
    <ul><li>foo<focus /></li></ul>
    <p>bar</p>
    `;
    const output = `
    <ol start="1"><li>foo<focus /></li></ol>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'numbered');
      },
    );
  });

  it('should change a bulleted list to a checklist', () => {
    const content = `
    <ul><li>foo<focus /></li></ul>
    <p>bar</p>
    `;
    const output = `
    <ul type="checklist"><li value="false">foo<focus /></li></ul>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'checklist');
      },
    );
  });

  it('should change multi-paragraph to multi-numbered-list', () => {
    const content = `
    <p>one</p>
    <p><anchor />two</p>
    <p>three</p>
    <p>four<focus /></p>
    <p>five</p>
    `;
    const output = `
    <p>one</p>
    <ol start="1"><li><anchor />two</li></ol>
    <ol start="2"><li>three</li></ol>
    <ol start="3"><li>four<focus /></li></ol>
    <p>five</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'numbered');
      },
    );
  });

  it('should change multi-bulleted-list to multi-numbered-list', () => {
    const content = `
    <p>one</p>
    <ul><li><anchor />two</li></ul>
    <ul indent="1"><li>three</li></ul>
    <ul indent="1"><li>four</li></ul>
    <ul><li>five<focus /></li></ul>
    <p>six</p>
    `;
    const output = `
    <p>one</p>
    <ol start="1"><li><anchor />two</li></ol>
    <ol indent="1" start="1"><li>three</li></ol>
    <ol indent="1" start="2"><li>four</li></ol>
    <ol start="1"><li>five<focus /></li></ol>
    <p>six</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'numbered');
      },
    );
  });

  it('should adjust start attributes when remove first item', () => {
    const content = `
    <p>one</p>
    <ol start="1"><li><focus />two</li></ol>
    <ol start="2"><li>three</li></ol>
    <ol start="3"><li>four</li></ol>
    <p>five</p>
    `;
    const output = `
    <p>one</p>
    <p><focus />two</p>
    <ol start="1"><li>three</li></ol>
    <ol start="2"><li>four</li></ol>
    <p>five</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'numbered');
      },
    );
  });

  it('should adjust start attributes when remove middle item', () => {
    const content = `
    <p>one</p>
    <ol start="1"><li>two</li></ol>
    <ol start="2"><li>three</li></ol>
    <ol start="3"><li>four<focus /></li></ol>
    <ol start="4"><li>five</li></ol>
    <ol start="5"><li>six</li></ol>
    <p>seven</p>
    `;
    const output = `
    <p>one</p>
    <ol start="1"><li>two</li></ol>
    <ol start="2"><li>three</li></ol>
    <p>four<focus /></p>
    <ol start="1"><li>five</li></ol>
    <ol start="2"><li>six</li></ol>
    <p>seven</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'numbered');
      },
    );
  });

  it('should adjust start attributes when remove two middle items', () => {
    const content = `
    <p>one</p>
    <ol start="1"><li>two</li></ol>
    <ol start="2"><li>three</li></ol>
    <ol start="3"><li><anchor />four</li></ol>
    <ol start="4"><li>five<focus /></li></ol>
    <ol start="5"><li>six</li></ol>
    <p>seven</p>
    `;
    const output = `
    <p>one</p>
    <ol start="1"><li>two</li></ol>
    <ol start="2"><li>three</li></ol>
    <p><anchor />four</p>
    <p>five<focus /></p>
    <ol start="1"><li>six</li></ol>
    <p>seven</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'numbered');
      },
    );
  });

  it('should change a paragraph to a checklist which value is true', () => {
    const content = `
    <p>foo<focus /></p>
    <p>bar</p>
    `;
    const output = `
    <ul type="checklist"><li value="true">foo<focus /></li></ul>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('list', 'checklist', true);
      },
    );
  });

});
