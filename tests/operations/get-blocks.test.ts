import { expect } from 'chai';
import { createContainer } from '../utils';
import { getBlocks } from '../../src/operations';

describe('operations.getBlocks()', () => {

  it('no text is selected', () => {
    const content = `
    <p>outer start</p>
    <p>foo<strong>bold</strong><focus /></p>
    <p>outer end</p>
    `;
    const { container, range } = createContainer(content);
    const blocks = getBlocks(range);
    container.remove();
    expect(blocks.length).to.equal(1);
    expect(blocks[0].html()).to.equal('foo<strong>bold</strong>');
  });

  it('after select the contents of a block', () => {
    const content = `
    <p>outer start</p>
    <p><anchor />foo<strong>bold</strong><focus /></p>
    <p>outer end</p>
    `;
    const { container, range } = createContainer(content);
    const blocks = getBlocks(range);
    container.remove();
    expect(blocks.length).to.equal(1);
    expect(blocks[0].html()).to.equal('foo<strong>bold</strong>');
  });

  it('after select multiple blocks', () => {
    const content = `
    <p>outer start</p>
    <p>f<anchor />oo<strong>bold</strong></p>
    <h1>heading</h1>
    <p><em>itelic</em>ba<focus />r</p>
    <p>outer end</p>
    `;
    const { container, range } = createContainer(content);
    const blocks = getBlocks(range);
    container.remove();
    expect(blocks.length).to.equal(3);
    expect(blocks[0].html()).to.equal('foo<strong>bold</strong>');
    expect(blocks[1].html()).to.equal('heading');
    expect(blocks[2].html()).to.equal('<em>itelic</em>bar');
  });

  it('no block', () => {
    const content = `
    foo<strong>bar<focus /></strong>
    `;
    const { container, range } = createContainer(content);
    const blocks = getBlocks(range);
    container.remove();
    expect(blocks.length).to.equal(0);
  });

  it('no block among other blocks', () => {
    const content = `
    <p>outer start</p>
    foo<strong>bar<focus /></strong>end
    <p>outer end</p>
    `;
    const { container, range } = createContainer(content);
    const blocks = getBlocks(range);
    container.remove();
    expect(blocks.length).to.equal(0);
  });

  it('returns a sub-block in the nested blocks when no text is selected', () => {
    const content = `
    <p>outer start</p>
    <h1><p>foo<strong>bold</strong><focus /></p></h1>
    <p>outer end</p>
    `;
    const { container, range } = createContainer(content);
    const blocks = getBlocks(range);
    container.remove();
    expect(blocks.length).to.equal(1);
    expect(blocks[0].html()).to.equal('foo<strong>bold</strong>');
  });

  it('returns top blocks in the nested blocks after select multiple blocks', () => {
    const content = `
    <p>outer start</p>
    <h1><p><anchor />foo1<strong>bold1</strong></p></h1>
    <h1><p>foo2<strong>bold2</strong><focus /></p></h1>
    <p>outer end</p>
    `;
    const { container, range } = createContainer(content);
    const blocks = getBlocks(range);
    container.remove();
    expect(blocks.length).to.equal(2);
    expect(blocks[0].html()).to.equal('<p>foo1<strong>bold1</strong></p>');
    expect(blocks[1].html()).to.equal('<p>foo2<strong>bold2</strong></p>');
  });

  it('returns sub-block in the nested blocks after select multiple blocks', () => {
    const content = `
    <p>outer start</p>
    <h1>
      <p><anchor />foo1<strong>bold1</strong></p>
      <p>foo2<strong>bold2</strong><focus /></p>
    </h1>
    <p>outer end</p>
    `;
    const { container, range } = createContainer(content);
    const blocks = getBlocks(range);
    container.remove();
    expect(blocks.length).to.equal(2);
    expect(blocks[0].html()).to.equal('foo1<strong>bold1</strong>');
    expect(blocks[1].html()).to.equal('foo2<strong>bold2</strong>');
  });

  it('the selection ends at the start of a block', () => {
    const content = `
    <p>outer start</p>
    <h1><anchor />foo<strong>bold</strong></h1>
    <p><focus />outer end</p>
    `;
    const { container, range } = createContainer(content);
    const blocks = getBlocks(range);
    container.remove();
    expect(blocks.length).to.equal(1);
    expect(blocks[0].html()).to.equal('foo<strong>bold</strong>');
  });

  it('selects all', () => {
    const content = `
    <anchor /><p>a</p>
    <p>b</p>
    <p>c</p><focus />
    `;
    const { container, range } = createContainer(content);
    const blocks = getBlocks(range);
    container.remove();
    expect(blocks.length).to.equal(3);
    expect(blocks[0].html()).to.equal('a');
    expect(blocks[1].html()).to.equal('b');
    expect(blocks[2].html()).to.equal('c');
  });

});
