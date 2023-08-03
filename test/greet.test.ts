import chai from 'chai';
import { sum } from '../src/greet';

const expect = chai.expect;

describe('sum test', function () {
  it('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).to.equal(3);
  });

  it('adds 1 + 2 to equal 4', () => {
    expect(sum(1, 2)).to.equal(4);
  });
});
