import { expect } from 'chai';
import { query, normalizeValue, denormalizeValue } from '../src/utils';
import { Range } from '../src/models';
import { insertBookmark, toBookmark } from '../src/operations';

export function testOperation(
  content: string,
  output: string,
  operation: (range: Range) => void,
) {
  const container = query('<div contenteditable="true"></div>').appendTo(document.body);
  container.html(normalizeValue(content));
  const range = new Range();
  const anchor = container.find('bookmark[type="anchor"]');
  const focus = container.find('bookmark[type="focus"]');
  toBookmark(range, {
    anchor,
    focus,
  });
  operation(range);
  insertBookmark(range);
  const html = denormalizeValue(container.html());
  container.remove();
  expect(html).to.equal(output);
}
