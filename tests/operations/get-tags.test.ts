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
    expect(tags.em).to.deep.equal({});
    expect(tags.strong).to.deep.equal({});
    expect(tags.p).to.deep.equal({});
    expect(tags.span).to.equal(undefined);
  });

  it('expanded range', () => {
    const content = `
    <p><strong>one<em>tw<anchor />o</em>three</strong><focus /></p>
    `;
    const { container, range } = createContainer(content);
    const tags = getTags(range);
    container.remove();
    expect(tags.em).to.deep.equal({});
    expect(tags.strong).to.deep.equal({});
    expect(tags.p).to.deep.equal({});
    expect(tags.span).to.equal(undefined);
  });

  it('getting attributes', () => {
    const content = `
    <p><span style="color: red;" class="foo">one<em>tw<focus />o</em>three</strong></p>
    `;
    const { container, range } = createContainer(content);
    const tags = getTags(range);
    container.remove();
    expect(tags.em).to.deep.equal({});
    expect(tags.strong).to.deep.equal(undefined);
    expect(tags.p).to.deep.equal({});
    expect(tags.span).to.deep.equal({style: 'color: red;', class: 'foo'});
  });

});
