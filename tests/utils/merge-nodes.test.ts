import { expect } from 'chai';
import { query, mergeNodes } from '../../src/utils';

describe('utils / merge-nodes', () => {

  it('no merging (text, p)', () => {
    const container = query('<div>foo<p>bar</p></div>');
    const points = mergeNodes(container.first(), container.last());
    expect(container.html()).to.equal('foo<p>bar</p>');
    expect(points.node.text()).to.equal('foo');
    expect(points.offset).to.equal(3);
  });

  it('no merging (p, text)', () => {
    const container = query('<div><p>foo</p>bar</div>');
    const points = mergeNodes(container.first(), container.last());
    expect(container.html()).to.equal('<p>foo</p>bar');
    expect(points.node.name).to.equal('div');
    expect(points.offset).to.equal(1);
  });

  it('no merging (hr, p)', () => {
    const container = query('<div><hr><p>foo</p></div>');
    const points = mergeNodes(container.first(), container.last());
    expect(container.html()).to.equal('<hr><p>foo</p>');
    expect(points.node.name).to.equal('div');
    expect(points.offset).to.equal(1);
  });

  it('no merging (p, hr)', () => {
    const container = query('<div><p>foo</p><hr></div>');
    const points = mergeNodes(container.first(), container.last());
    expect(container.html()).to.equal('<p>foo</p><hr>');
    expect(points.node.name).to.equal('div');
    expect(points.offset).to.equal(1);
  });

  it('merges two paragraphs (p-strong-i-text, p-text) into one paragraph', () => {
    const container = query('<div><p><strong><i>foo</i></strong></p><p>bar</p></div>');
    const points = mergeNodes(container.first(), container.last());
    expect(container.html()).to.equal('<p><strong><i>foo</i></strong>bar</p>');
    expect(points.node.name).to.equal('p');
    expect(points.offset).to.equal(1);
  });

  it('merges two paragraphs (p-text, p-strong-i-text) into one paragraph', () => {
    const container = query('<div><p>foo</p><p><strong><i>bar</i></strong></p></div>');
    const points = mergeNodes(container.first(), container.last());
    expect(container.html()).to.equal('<p>foo<strong><i>bar</i></strong></p>');
    expect(points.node.text()).to.equal('foo');
    expect(points.offset).to.equal(3);
  });

  it('merges two paragraphs (p-strong-i-text, p-strong-i-text) into one paragraph', () => {
    const container = query('<div><p><strong><i>foo</i></strong></p><p><strong><i>bar</i></strong></p></div>');
    const points = mergeNodes(container.first(), container.last());
    expect(container.html()).to.equal('<p><strong><i>foobar</i></strong></p>');
    expect(points.node.text()).to.equal('foo');
    expect(points.offset).to.equal(3);
  });

  it('merges two paragraphs (p-i-text, p-strong-i-text) into one paragraph', () => {
    const container = query('<div><p><i>foo</i></p><p><strong><i>bar</i></strong></p></div>');
    const points = mergeNodes(container.first(), container.last());
    expect(container.html()).to.equal('<p><i>foo</i><strong><i>bar</i></strong></p>');
    expect(points.node.name).to.equal('p');
    expect(points.offset).to.equal(1);
  });

  it('merges two paragraphs (p-br, p-text) into one paragraph', () => {
    const container = query('<div><p><br></p><p>foo</p></div>');
    const points = mergeNodes(container.first(), container.last());
    expect(container.html()).to.equal('<p>foo</p>');
    expect(points.node.name).to.equal('p');
    expect(points.offset).to.equal(0);
  });

  it('merges two paragraphs (p-text, p-br) into one paragraph', () => {
    const container = query('<div><p>foo</p><p><br></p></div>');
    const points = mergeNodes(container.first(), container.last());
    expect(container.html()).to.equal('<p>foo</p>');
    expect(points.node.text()).to.equal('foo');
    expect(points.offset).to.equal(3);
  });

  it('merges two paragraphs (p-span, p-span) into one paragraph', () => {
    const container = query('<div><p><span style="color: red;">foo</span></p><p><span style="background-color: blue;">bar</span></p></div>');
    const points = mergeNodes(container.first(), container.last());
    expect(container.html()).to.equal('<p><span style="color: red;">foo</span><span style="background-color: blue;">bar</span></p>');
    expect(points.node.name).to.equal('p');
    expect(points.offset).to.equal(1);
  });

  it('merges two paragraphs (p-box, p-box) into one paragraph', () => {
    const container = query('<div><p><lake-box type="inline" name="inlineBox"></lake-box></p><p><lake-box type="inline" name="inlineBox"></lake-box></p></div>');
    const points = mergeNodes(container.first(), container.last());
    expect(container.html()).to.equal('<p><lake-box type="inline" name="inlineBox"></lake-box><lake-box type="inline" name="inlineBox"></lake-box></p>');
    expect(points.node.name).to.equal('p');
    expect(points.offset).to.equal(1);
  });

  it('merges two list (ul-li, checklist) into one bulleted list', () => {
    const container = query('<div><ul><li>foo</li></ul><ul type="checklist"><li value="true">bar</li></ul></div>');
    const points = mergeNodes(container.first(), container.last());
    expect(container.html()).to.equal('<ul><li>foobar</li></ul>');
    expect(points.node.text()).to.equal('foo');
    expect(points.offset).to.equal(3);
  });

  it('merges two list (checklist, ul-li) into one bulleted list', () => {
    const container = query('<div><ul type="checklist"><li value="true">foo</li></ul><ul><li>bar</li></ul></div>');
    const points = mergeNodes(container.first(), container.last());
    expect(container.html()).to.equal('<ul type="checklist"><li value="true">foobar</li></ul>');
    expect(points.node.text()).to.equal('foo');
    expect(points.offset).to.equal(3);
  });

  it('merges two blocks (p-text, checklist) into one pragraph', () => {
    const container = query('<div><p>foo</p><ul type="checklist"><li value="true">bar</li></ul></div>');
    const points = mergeNodes(container.first(), container.last());
    expect(container.html()).to.equal('<p>foobar</p>');
    expect(points.node.text()).to.equal('foo');
    expect(points.offset).to.equal(3);
  });

  it('merges two blocks (checklist, p-text) into one checklist', () => {
    const container = query('<div><ul type="checklist"><li value="true">foo</li></ul><p>bar</p></div>');
    const points = mergeNodes(container.first(), container.last());
    expect(container.html()).to.equal('<ul type="checklist"><li value="true">foobar</li></ul>');
    expect(points.node.text()).to.equal('foo');
    expect(points.offset).to.equal(3);
  });

});
