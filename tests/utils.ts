import { expect } from 'chai';
import { query, normalizeValue, denormalizeValue, debug } from '../src/utils';
import { Nodes, Range } from '../src/models';
import { insertBookmark } from '../src/operations/insert-bookmark';
import { toBookmark } from '../src/operations/to-bookmark';
import LakeCore from '../src';

function format(value: string) {
  value = value.replace(/>[\s\r\n]+</g, '><');
  value = value.replace(/<br>/ig, '<br />');
  return value.trim();
}

export function createContainer(content: string): { container: Nodes, range: Range} {
  const container = query('<div contenteditable="true"></div>');
  query(document.body).append(container);
  container.html(normalizeValue(format(content)));
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
  callback: (range: Range) => void,
) {
  const { container, range } = createContainer(content);
  callback(range);
  insertBookmark(range);
  const html = denormalizeValue(format(container.html()));
  container.remove();
  debug(html);
  expect(html).to.equal(format(output));
}

export function testPlugin(
  content: string,
  output: string,
  callback: (editor: LakeCore) => void,
) {
  const { container } = createContainer(content);
  const editor = new LakeCore(container.get(0), {
    className: 'my-editor-container',
    defaultValue: format(content),
  });
  editor.create();
  callback(editor);
  const html = editor.getValue();
  editor.remove();
  debug(html);
  expect(html).to.equal(format(output));
}
