import { expect } from 'chai';
import { query, setBlockIndent } from '../../src/utils';

describe('utils / set-block-indent', () => {

  it('paragraph: should add indent', () => {
    const block = query('<p>heading</p>');
    setBlockIndent(block, 'increase');
    expect(block.outerHTML()).to.equal('<p style="margin-left: 40px;">heading</p>');
  });

  it('paragraph: should update indent', () => {
    const block = query('<p style="margin-left: 40px;">heading</p>');
    setBlockIndent(block, 'increase');
    expect(block.outerHTML()).to.equal('<p style="margin-left: 80px;">heading</p>');
  });

  it('paragraph: should remove indent', () => {
    const block = query('<p style="margin-left: 40px;">heading</p>');
    setBlockIndent(block, 'decrease');
    expect(block.outerHTML()).to.equal('<p>heading</p>');
  });

  it('paragraph: should remove text-indent', () => {
    const block = query('<p style="text-indent: 2em;">heading</p>');
    setBlockIndent(block, 'decrease');
    expect(block.outerHTML()).to.equal('<p>heading</p>');
  });

  it('list: should add indent', () => {
    const block = query('<ul><li>foo</li></ul>');
    setBlockIndent(block, 'increase');
    expect(block.outerHTML()).to.equal('<ul indent="1"><li>foo</li></ul>');
  });

  it('list: should update indent', () => {
    const block = query('<ul indent="1"><li>foo</li></ul>');
    setBlockIndent(block, 'increase');
    expect(block.outerHTML()).to.equal('<ul indent="2"><li>foo</li></ul>');
  });

  it('list: should remove indent', () => {
    const block = query('<ul indent="1"><li>foo</li></ul>');
    setBlockIndent(block, 'decrease');
    expect(block.outerHTML()).to.equal('<ul><li>foo</li></ul>');
  });

});
