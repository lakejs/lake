import { expect } from 'chai';
import { query, mergeNodes } from '../../src/utils';

describe('utils.mergeNodes()', () => {

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

  it('merges two paragraphs (strong-i-text, text) into one paragraph', () => {
    const container = query('<div><p><strong><i>foo</i></strong></p><p>bar</p></div>');
    const points = mergeNodes(container.first(), container.last());
    expect(container.html()).to.equal('<p><strong><i>foo</i></strong>bar</p>');
    expect(points.node.name).to.equal('p');
    expect(points.offset).to.equal(1);
  });

  it('merges two paragraphs (text, strong-i-text) into one paragraph', () => {
    const container = query('<div><p>foo</p><p><strong><i>bar</i></strong></p></div>');
    const points = mergeNodes(container.first(), container.last());
    expect(container.html()).to.equal('<p>foo<strong><i>bar</i></strong></p>');
    expect(points.node.text()).to.equal('foo');
    expect(points.offset).to.equal(3);
  });

  it('merges two paragraphs (strong-i-text, strong-i-text) into one paragraph', () => {
    const container = query('<div><p><strong><i>foo</i></strong></p><p><strong><i>bar</i></strong></p></div>');
    const points = mergeNodes(container.first(), container.last());
    expect(container.html()).to.equal('<p><strong><i>foobar</i></strong></p>');
    expect(points.node.text()).to.equal('foo');
    expect(points.offset).to.equal(3);
  });

  it('merges two paragraphs (span, span) into one paragraph', () => {
    const container = query('<div><p><span style="color: red;">foo</span></p><p><span style="background-color: blue;">bar</span></p></div>');
    const points = mergeNodes(container.first(), container.last());
    expect(container.html()).to.equal('<p><span style="color: red;">foo</span><span style="background-color: blue;">bar</span></p>');
    expect(points.node.name).to.equal('p');
    expect(points.offset).to.equal(1);
  });

});
