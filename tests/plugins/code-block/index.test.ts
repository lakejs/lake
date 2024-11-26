import { getBox } from 'lakelib/utils/get-box';
import { testPlugin } from '../../utils';

describe('plugins / code-block / index', () => {

  it('should return correct config', () => {
    testPlugin(
      '',
      '',
      editor => {
        expect(editor.config.codeBlock.langList[0]).to.equal('text');
        expect(editor.config.codeBlock.defaultLang).to.equal('text');
      },
    );
  });

  it('should insert into the end of the paragraph', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="codeBlock" focus="end"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('codeBlock');
      },
    );
  });

  it('should insert a code block with default value', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="codeBlock" focus="end"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        const defaultValue = {
          lang: 'css',
          code: '.hello { }',
        };
        editor.command.execute('codeBlock', defaultValue);
        const boxNode = editor.container.find('lake-box');
        const box = getBox(boxNode);
        expect(box.value).to.deep.equal(defaultValue);
      },
      true,
    );
  });

});
