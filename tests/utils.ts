import { BoxValue } from '../src/types/box';
import { query, getBox, normalizeValue, denormalizeValue, debug } from '../src/utils';
import { Nodes } from '../src/models/nodes';
import { Range } from '../src/models/range';
import { Box } from '../src/models/box';
import { HTMLParser } from '../src/parsers/html-parser';
import { insertBookmark } from '../src/operations/insert-bookmark';
import { toBookmark } from '../src/operations/to-bookmark';
import { Editor } from '../src';

export function click(node: Nodes): void {
  (node.get(0) as HTMLElement).click();
}

export function removeBoxValueFromHTML(value: string): string {
  return value.replace(/(<lake-box[^>]+)\s+value="[^"]+"([^>]*>)/g, '$1$2');
}

export function formatHTML(value: string): string {
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
): void {
  const { container, range } = createContainer(content);
  callback(range);
  insertBookmark(range);
  let html = new HTMLParser(container).getHTML();
  html = denormalizeValue(html);
  container.remove();
  debug(`output: ${html}`);
  expect(html).to.equal(formatHTML(output));
}

export function showBox(
  name: string,
  value?: BoxValue,
  callback?: (box: Box, editor?: Editor) => void,
  readonly: boolean = false,
): void {
  const rootNode = query('<div class="lake-root" />');
  query(document.body).append(rootNode);
  let box = new Box(name);
  if (value) {
    box.value = value;
  }
  let content;
  if (box.type === 'inline') {
    content = `<p>${box.node.outerHTML()}</p>`;
  } else {
    content = box.node.outerHTML();
  }
  const editor = new Editor({
    root: rootNode,
    value: content,
    readonly,
  });
  editor.render();
  box = getBox(editor.container.find('lake-box'));
  if (callback) {
    callback(box, editor);
  }
}

export function testPlugin(
  content: string,
  output: string,
  callback: (editor: Editor) => void,
  removeBoxValue: boolean = false,
): void {
  const defaultValue = '<p><br /><focus /></p>';
  const rootNode = query('<div class="lake-root" />');
  query(document.body).append(rootNode);
  const editor = new Editor({
    root: rootNode,
    value: content || defaultValue,
  });
  editor.render();
  callback(editor);
  let html: string;
  if (removeBoxValue) {
    html = removeBoxValueFromHTML(editor.getValue());
  } else {
    html = editor.getValue();
  }
  editor.unmount();
  rootNode.remove();
  debug(`output: ${html}`);
  expect(html).to.equal(formatHTML(output || defaultValue));
}
