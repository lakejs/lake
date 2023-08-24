import { expect } from 'chai';
import { query, normalizeValue, denormalizeValue } from '../src/utils';
import { Nodes, Range } from '../src/models';
import { insertBookmark, toBookmark } from '../src/operations';

function removeBlanks(value: string) {
  value = value.replace(/>[\s\r\n]+</g, '><');
  return value.trim();
}

export function createContainer(content: string): { container: Nodes, range: Range} {
  const container = query('<div contenteditable="true"></div>').appendTo(document.body);
  container.html(normalizeValue(removeBlanks(content)));
  const range = new Range();
  const anchor = container.find('bookmark[type="anchor"]');
  const focus = container.find('bookmark[type="focus"]');
  toBookmark(range, {
    anchor,
    focus,
  });
  return {
    container,
    range,
  };
}

export function testOperation(
  content: string,
  output: string,
  operation: (range: Range) => void,
) {
  const { container, range } = createContainer(content);
  operation(range);
  insertBookmark(range);
  const html = denormalizeValue(container.html());
  container.remove();
  expect(html).to.equal(removeBlanks(output));
}
