import { testPlugin } from '../utils';
import { getBox } from '../../src/utils';

describe('plugins / equation', () => {

  it('should insert an equation', () => {
    const content = `
    <p>foo<focus />bar</p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="equation" focus="end"></lake-box>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.command.execute('equation');
      },
    );
  });

  it('should insert an equation with default value', () => {
    const content = `
    <p>foo<focus /></p>
    `;
    const output = `
    <p>foo<lake-box type="inline" name="equation" focus="end"></lake-box></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        const code = String.raw`c = \pm\sqrt{a^2 + b^2}`;
        const defaultValue = {
          code,
        };
        editor.command.execute('equation', defaultValue);
        const boxNode = editor.container.find('lake-box');
        const box = getBox(boxNode);
        expect(box.value).to.deep.equal(defaultValue);
      },
      true,
    );
  });

});
