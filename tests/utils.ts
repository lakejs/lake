import { BoxValue } from '../src/types/box';
import { query, normalizeValue, denormalizeValue, debug } from '../src/utils';
import { Nodes } from '../src/models/nodes';
import { Range } from '../src/models/range';
import { Box } from '../src/models/box';
import { HTMLParser } from '../src/parsers/html-parser';
import { insertBookmark } from '../src/operations/insert-bookmark';
import { toBookmark } from '../src/operations/to-bookmark';
import { Editor } from '../src';

export function formatHTML(value: string) {
  value = normalizeValue(value);
  value = new HTMLParser(value).getHTML();
  value = denormalizeValue(value);
  return value;
}

export function getContainerValue(container: Nodes): string {
  let value = new HTMLParser(container).getHTML();
  value = denormalizeValue(value);
  return value;
}

export function setContainerValue(container: Nodes, value: string): Range {
  container.empty();
  value = normalizeValue(value);
  const htmlParser = new HTMLParser(value);
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
    return range;
  }
  const anchor = container.find('lake-bookmark[type="anchor"]');
  const focus = container.find('lake-bookmark[type="focus"]');
  toBookmark(range, {
    anchor,
    focus,
  });
  return range;
}

export function createContainer(content: string): { container: Nodes, range: Range} {
  const container = query('<div contenteditable="true"></div>');
  query(document.body).append(container);
  const range = setContainerValue(container, content);
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

export function testBox(
  name: string,
  value?: BoxValue,
  callback?: (box: Box, editor?: Editor) => void,
) {
  const targetNode = query('<div class="lake-main" />');
  query(document.body).append(targetNode);
  const editor = new Editor({
    root: targetNode,
    value: '<p><br /><focus /></p>',
  });
  editor.render();
  const box = editor.insertBox(name, value);
  if (callback && box) {
    callback(box, editor);
  }
}

export function testPlugin(
  content: string,
  output: string,
  callback: (editor: Editor) => void,
) {
  const targetNode = query('<div class="lake-main" />');
  query(document.body).append(targetNode);
  const editor = new Editor({
    root: targetNode,
    value: content,
  });
  editor.render();
  callback(editor);
  const html = editor.getValue();
  editor.unmount();
  targetNode.remove();
  debug(`output: ${html}`);
  expect(html).to.equal(formatHTML(output));
}
