import { expect } from 'chai';
import { createContainer } from '../utils';
import { getTags } from '../../src/operations/get-tags';

describe('operations.getTags()', () => {

  it('is a collapsed range', () => {
    const content = `
    <p><strong>one<i>tw<focus />o</i>three</strong></p>
    `;
    const { container, range } = createContainer(content);
    const tags = getTags(range);
    container.remove();
    expect(tags.length).to.equal(3);
    expect(tags[0].name).to.equal('i');
    expect(tags[1].name).to.equal('strong');
    expect(tags[2].name).to.equal('p');
  });

  it('is an expanded range', () => {
    const content = `
    <p><strong>one<i>tw<anchor />o</i>three</strong><focus /></p>
    `;
    const { container, range } = createContainer(content);
    const tags = getTags(range);
    container.remove();
    expect(tags.length).to.equal(3);
    expect(tags[0].name).to.equal('i');
    expect(tags[1].name).to.equal('strong');
    expect(tags[2].name).to.equal('p');
  });

  it('gets attributes', () => {
    const content = `
    <p><span style="color: red;" class="foo">one<i>tw<focus />o</i>three</strong></p>
    `;
    const { container, range } = createContainer(content);
    const tags = getTags(range);
    container.remove();
    expect(tags.length).to.equal(3);
    expect(tags[0].name).to.equal('i');
    expect(tags[1].name).to.equal('span');
    expect(tags[1].attributes).to.deep.equal({style: 'color: red;', class: 'foo'});
    expect(tags[2].name).to.deep.equal('p');
  });

  it('should get strong tag', () => {
    const content = `
    <p>one<anchor /><i><strong>two</strong></i><focus />three</p>
    `;
    const { container, range } = createContainer(content);
    const tags = getTags(range);
    container.remove();
    expect(tags.length).to.equal(3);
    expect(tags[0].name).to.equal('p');
    expect(tags[1].name).to.equal('i');
    expect(tags[2].name).to.equal('strong');
  });

});
