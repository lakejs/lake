import { expect } from 'chai';
import { query, normalizeValue, denormalizeValue, debug } from '../src/utils';
import { Nodes } from '../src/models/nodes';
import { Range } from '../src/models/range';
import { HTMLParser } from '../src/parsers/html-parser';
import { insertBookmark } from '../src/operations/insert-bookmark';
import { toBookmark } from '../src/operations/to-bookmark';
import Editor from '../src';

export function formatHTML(value: string) {
  value = normalizeValue(value);
  value = new HTMLParser(value).getHTML();
  value = denormalizeValue(value);
  return value;
}

export function createContainer(content: string): { container: Nodes, range: Range} {
  const container = query('<div contenteditable="true"></div>');
  query(document.body).append(container);
  content = normalizeValue(content);
  const htmlParser = new HTMLParser(content);
  for (const node of htmlParser.getNodeList()) {
    container.append(node);
  }
  const range = new Range();
  const boxFocus = container.find('lake-box[focus]');
  if (boxFocus.length > 0) {
    toBookmark(range, {
      anchor: new Nodes(),
      focus: boxFocus,
    });
    return {
      container,
      range,
    };
  }
  const anchor = container.find('lake-bookmark[type="anchor"]');
  const focus = container.find('lake-bookmark[type="focus"]');
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
  let html = new HTMLParser(container).getHTML();
  html = denormalizeValue(html);
  container.remove();
  debug(`output: ${html}`);
  expect(html).to.equal(formatHTML(output));
}

export function testPlugin(
  content: string,
  output: string,
  callback: (editor: Editor) => void,
) {
  const targetNode = query('<div />');
  query(document.body).append(targetNode);
  const editor = new Editor(targetNode.get(0), {
    className: 'my-editor-container',
    defaultValue: content,
  });
  editor.create();
  callback(editor);
  const html = editor.getValue();
  editor.remove();
  targetNode.remove();
  debug(`output: ${html}`);
  expect(html).to.equal(formatHTML(output));
}
