import { expect } from 'chai';
import { createContainer } from '../utils';
import { getMarks } from '../../src/operations/get-marks';

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
    <p><i><anchor />foo<strong>bold</strong><focus /></i></p>
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
    <p><i><anchor />foo</i><strong>bold</strong><focus /></p>
    `;
    const { container, range } = createContainer(content);
    const marks = getMarks(range);
    container.remove();
    expect(marks.length).to.equal(4);
    expect(marks[0].name).to.equal('i');
    expect(marks[1].text()).to.equal('foo');
    expect(marks[2].name).to.equal('strong');
    expect(marks[3].text()).to.equal('bold');
  });

});
