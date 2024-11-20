import {
  // constants
  icons,
  // classes
  Editor,
  Toolbar,
  Button,
  Dropdown,
  Nodes,
  Fragment,
  Range,
  Box,
  HTMLParser,
  TextParser,
  // functions
  query,
  template,
  toHex,
  insertBookmark,
  toBookmark,
  insertContents,
  deleteContents,
  setBlocks,
  splitBlock,
  insertBlock,
  splitMarks,
  addMark,
  removeMark,
  insertBox,
  removeBox,
} from '../src';

describe('check exports', () => {

  it('index', () => {
    expect(typeof icons).to.equal('object');
    expect(typeof Editor).to.equal('function');
    expect(typeof Toolbar).to.equal('function');
    expect(typeof Button).to.equal('function');
    expect(typeof Dropdown).to.equal('function');
    expect(typeof Nodes).to.equal('function');
    expect(typeof Fragment).to.equal('function');
    expect(typeof Range).to.equal('function');
    expect(typeof Box).to.equal('function');
    expect(typeof HTMLParser).to.equal('function');
    expect(typeof TextParser).to.equal('function');
    expect(typeof query).to.equal('function');
    expect(typeof template).to.equal('function');
    expect(typeof toHex).to.equal('function');
    expect(typeof insertBookmark).to.equal('function');
    expect(typeof toBookmark).to.equal('function');
    expect(typeof insertContents).to.equal('function');
    expect(typeof deleteContents).to.equal('function');
    expect(typeof setBlocks).to.equal('function');
    expect(typeof splitBlock).to.equal('function');
    expect(typeof insertBlock).to.equal('function');
    expect(typeof splitMarks).to.equal('function');
    expect(typeof addMark).to.equal('function');
    expect(typeof removeMark).to.equal('function');
    expect(typeof insertBox).to.equal('function');
    expect(typeof removeBox).to.equal('function');
  });

});
