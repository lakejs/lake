import { BoxValue } from '@/types/box';
import { debug } from '@/utils/debug';
import { query } from '@/utils/query';
import { getBox } from '@/utils/get-box';
import { normalizeValue } from '@/utils/normalize-value';
import { denormalizeValue } from '@/utils/denormalize-value';
import { Nodes } from '@/models/nodes';
import { Range } from '@/models/range';
import { Box } from '@/models/box';
import { HTMLParser } from '@/parsers/html-parser';
import { insertBookmark } from '@/operations/insert-bookmark';
import { toBookmark } from '@/operations/to-bookmark';
import { Editor } from '@/editor';

// Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/600.8.9 (KHTML, like Gecko) Version/8.0.8 Safari/600.8.9
export const isMac = navigator.userAgent.indexOf('Mac OS X') >= 0;

// Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0
export const isFirefox = navigator.userAgent.indexOf('Firefox/') >= 0;

// Helper function to convert a base64 data string to binary format
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64); // Decode base64
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export function click(node: Nodes): void {
  (node.get(0) as HTMLElement).click();
}

export function removeBoxValueFromHTML(value: string): string {
  return value.replace(/(<lake-box[^>]+)\svalue="[^"]+"([^>]*>)/g, '$1$2');
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
  container.append(htmlParser.getFragment());
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

export function createContainer(content: string): { container: Nodes, range: Range } {
  const container = query('<div class="lake-container" contenteditable="true"></div>');
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
  readonly = false,
): void {
  const rootNode = query('<div class="lake-root lake-ui-test" />');
  query(document.body).append(rootNode);
  let box = getBox(name);
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
  removeBoxValue = false,
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
