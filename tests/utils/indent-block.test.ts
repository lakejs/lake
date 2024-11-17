import { query } from '../../src/utils/query';
import { indentBlock } from '../../src/utils/indent-block';

describe('utils / indent-block', () => {

  it('paragraph: should add indent', () => {
    const block = query('<p>heading</p>');
    indentBlock(block, 'increase');
    expect(block.outerHTML()).to.equal('<p style="margin-left: 40px;">heading</p>');
  });

  it('paragraph: should update indent', () => {
    const block = query('<p style="margin-left: 40px;">heading</p>');
    indentBlock(block, 'increase');
    expect(block.outerHTML()).to.equal('<p style="margin-left: 80px;">heading</p>');
  });

  it('paragraph: should remove indent', () => {
    const block = query('<p style="margin-left: 40px;">heading</p>');
    indentBlock(block, 'decrease');
    expect(block.outerHTML()).to.equal('<p>heading</p>');
  });

  it('paragraph: should remove text-indent', () => {
    const block = query('<p style="text-indent: 2em;">heading</p>');
    indentBlock(block, 'decrease');
    expect(block.outerHTML()).to.equal('<p>heading</p>');
  });

  it('list: should add indent', () => {
    const block = query('<ul><li>foo</li></ul>');
    indentBlock(block, 'increase');
    expect(block.outerHTML()).to.equal('<ul indent="1"><li>foo</li></ul>');
  });

  it('list: should update indent', () => {
    const block = query('<ul indent="1"><li>foo</li></ul>');
    indentBlock(block, 'increase');
    expect(block.outerHTML()).to.equal('<ul indent="2"><li>foo</li></ul>');
  });

  it('list: should remove indent', () => {
    const block = query('<ul indent="1"><li>foo</li></ul>');
    indentBlock(block, 'decrease');
    expect(block.outerHTML()).to.equal('<ul><li>foo</li></ul>');
  });

});
