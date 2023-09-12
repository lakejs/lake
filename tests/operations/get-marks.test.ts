import { expect } from 'chai';
import { createContainer } from '../utils';
import { getMarks } from '../../src/operations';

describe('operations.getMarks()', () => {

  it('should get text and mark nodes', () => {
    const content = `
    <p><anchor />foo<strong>bold</strong><focus /></p>
    `;
    const { container, range } = createContainer(content);
    const marks = getMarks(range);
    container.remove();
    expect(marks.length).to.equal(3);
    expect(marks[0].text()).to.equal('foo');
    expect(marks[1].name).to.equal('strong');
    expect(marks[2].text()).to.equal('bold');
  });

  it('the range is in the other mark', () => {
    const content = `
    <p><em><anchor />foo<strong>bold</strong><focus /></em></p>
    `;
    const { container, range } = createContainer(content);
    const marks = getMarks(range);
    container.remove();
    expect(marks.length).to.equal(3);
    expect(marks[0].text()).to.equal('foo');
    expect(marks[1].name).to.equal('strong');
    expect(marks[2].text()).to.equal('bold');
  });

  it('the range is part of a mark', () => {
    const content = `
    <p><em><anchor />foo</em><strong>bold</strong><focus /></p>
    `;
    const { container, range } = createContainer(content);
    const marks = getMarks(range);
    container.remove();
    expect(marks.length).to.equal(4);
    expect(marks[0].name).to.equal('em');
    expect(marks[1].text()).to.equal('foo');
    expect(marks[2].name).to.equal('strong');
    expect(marks[3].text()).to.equal('bold');
  });

});
