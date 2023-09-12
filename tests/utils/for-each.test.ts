import { expect } from 'chai';
import { forEach } from '../../src/utils';

describe('utils.forEach()', () => {

  it('is plain object', () => {
    const oldObject = {
      one: 1,
      two: 2,
      three: 3,
    };
    const newObject: { [key: string]: number } = {};
    forEach(oldObject, (key, value) => {
      newObject[key] = value;
    });
    expect(oldObject).to.deep.equal(newObject);
  });

});
