import chai from 'chai';

type ChaiExpectStatic = typeof chai.expect;

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var expect: ChaiExpectStatic;
}
