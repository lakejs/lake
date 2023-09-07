import { expect } from 'chai';
import { createContainer } from '../utils';
import { getTags } from '../../src/operations';

describe('operations.getTags()', () => {

  it('getting tags', () => {
    const content = `
    <p><strong>one<em>tw<focus />o</em>three</strong></p>
    `;
    const { container, range } = createContainer(content);
    const tags = getTags(range);
    container.remove();
    expect(tags.length).to.equal(3);
    expect(tags[0].name).to.equal('em');
    expect(tags[1].name).to.equal('strong');
    expect(tags[2].name).to.equal('p');
  });

  it('expanded range', () => {
    const content = `
    <p><strong>one<em>tw<anchor />o</em>three</strong><focus /></p>
    `;
    const { container, range } = createContainer(content);
    const tags = getTags(range);
    container.remove();
    expect(tags.length).to.equal(3);
    expect(tags[0].name).to.equal('em');
    expect(tags[1].name).to.equal('strong');
    expect(tags[2].name).to.equal('p');
  });

  it('getting attributes', () => {
    const content = `
    <p><span style="color: red;" class="foo">one<em>tw<focus />o</em>three</strong></p>
    `;
    const { container, range } = createContainer(content);
    const tags = getTags(range);
    container.remove();
    expect(tags.length).to.equal(3);
    expect(tags[0].name).to.equal('em');
    expect(tags[1].name).to.equal('span');
    expect(tags[1].attributes).to.deep.equal({style: 'color: red;', class: 'foo'});
    expect(tags[2].name).to.deep.equal('p');
  });

  it('should get strong tag', () => {
    const content = `
    <p>one<anchor /><em><strong>two</strong></em><focus />three</p>
    `;
    const { container, range } = createContainer(content);
    const tags = getTags(range);
    container.remove();
    expect(tags.length).to.equal(3);
    expect(tags[0].name).to.equal('p');
    expect(tags[1].name).to.equal('em');
    expect(tags[2].name).to.equal('strong');
  });

});