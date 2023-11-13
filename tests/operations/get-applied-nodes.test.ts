import { expect } from 'chai';
import { createContainer } from '../utils';
import { getAppliedNodes } from '../../src/operations/get-applied-nodes';

describe('operations.getAppliedNodes()', () => {

  it('is a collapsed range', () => {
    const content = `
    <p><strong>one<i>tw<focus />o</i>three</strong></p>
    `;
    const { container, range } = createContainer(content);
    const appliedNodes = getAppliedNodes(range);
    container.remove();
    expect(appliedNodes.length).to.equal(3);
    expect(appliedNodes[0].name).to.equal('i');
    expect(appliedNodes[1].name).to.equal('strong');
    expect(appliedNodes[2].name).to.equal('p');
  });

  it('is an expanded range', () => {
    const content = `
    <p><strong>one<i>tw<anchor />o</i>three</strong><focus /></p>
    `;
    const { container, range } = createContainer(content);
    const appliedNodes = getAppliedNodes(range);
    container.remove();
    expect(appliedNodes.length).to.equal(3);
    expect(appliedNodes[0].name).to.equal('i');
    expect(appliedNodes[1].name).to.equal('strong');
    expect(appliedNodes[2].name).to.equal('p');
  });

  it('gets attributes', () => {
    const content = `
    <p><span style="color: red;" class="foo">one<i>tw<focus />o</i>three</strong></p>
    `;
    const { container, range } = createContainer(content);
    const appliedNodes = getAppliedNodes(range);
    container.remove();
    expect(appliedNodes.length).to.equal(3);
    expect(appliedNodes[0].name).to.equal('i');
    expect(appliedNodes[1].name).to.equal('span');
    expect(appliedNodes[1].attributes).to.deep.equal({style: 'color: red;', class: 'foo'});
    expect(appliedNodes[2].name).to.deep.equal('p');
  });

  it('should get strong tag', () => {
    const content = `
    <p>one<anchor /><i><strong>two</strong></i><focus />three</p>
    `;
    const { container, range } = createContainer(content);
    const appliedNodes = getAppliedNodes(range);
    container.remove();
    expect(appliedNodes.length).to.equal(3);
    expect(appliedNodes[0].name).to.equal('p');
    expect(appliedNodes[1].name).to.equal('i');
    expect(appliedNodes[2].name).to.equal('strong');
  });

});
