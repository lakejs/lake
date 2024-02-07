import './css/editor.css';
import './css/mark.css';
import './css/format-painter.css';
import './css/heading.css';
import './css/list.css';
import './css/blockquote.css';
import './css/box.css';
import './css/hr.css';
import './css/image.css';
import { BoxComponent } from './types/box';
import * as Utils from './utils';
import { Nodes } from './models/nodes';
import { Fragment } from './models/fragment';
import { Range } from './models/range';
import { Box } from './models/box';
import { HTMLParser } from './parsers/html-parser';
import { TextParser } from './parsers/text-parser';
import { Editor } from './editor';
import copy from './plugins/copy';
import cut from './plugins/cut';
import paste from './plugins/paste';
import undo from './plugins/undo';
import redo from './plugins/redo';
import selectAll from './plugins/select-all';
import heading from './plugins/heading';
import blockquote from './plugins/blockquote';
import list from './plugins/list';
import align from './plugins/align';
import indent from './plugins/indent';
import bold from './plugins/bold';
import italic from './plugins/italic';
import underline from './plugins/underline';
import strikethrough from './plugins/strikethrough';
import subscript from './plugins/subscript';
import superscript from './plugins/superscript';
import code from './plugins/code';
import fontFamily from './plugins/font-family';
import fontSize from './plugins/font-size';
import fontColor from './plugins/font-color';
import highlight from './plugins/highlight';
import removeFormat from './plugins/remove-format';
import formatPainter from './plugins/format-painter';
import link from './plugins/link';
import unlink from './plugins/unlink';
import hr, { hrBox } from './plugins/hr';
import image, { imageBox } from './plugins/image';
import enterKey from './plugins/enter-key';
import shiftEnterKey from './plugins/shift-enter-key';
import backspaceKey from './plugins/backspace-key';
import deleteKey from './plugins/delete-key';
import tabKey from './plugins/tab-key';
import arrowKeys from './plugins/arrow-keys';
import markdown from './plugins/markdown';

Editor.box.add(hrBox);
Editor.box.add(imageBox);

Editor.plugin.add(copy);
Editor.plugin.add(cut);
Editor.plugin.add(paste);
Editor.plugin.add(undo);
Editor.plugin.add(redo);
Editor.plugin.add(selectAll);
Editor.plugin.add(heading);
Editor.plugin.add(blockquote);
Editor.plugin.add(list);
Editor.plugin.add(align);
Editor.plugin.add(indent);
Editor.plugin.add(bold);
Editor.plugin.add(italic);
Editor.plugin.add(underline);
Editor.plugin.add(strikethrough);
Editor.plugin.add(subscript);
Editor.plugin.add(superscript);
Editor.plugin.add(code);
Editor.plugin.add(fontFamily);
Editor.plugin.add(fontSize);
Editor.plugin.add(fontColor);
Editor.plugin.add(highlight);
Editor.plugin.add(removeFormat);
Editor.plugin.add(formatPainter);
Editor.plugin.add(link);
Editor.plugin.add(unlink);
Editor.plugin.add(hr);
Editor.plugin.add(image);
Editor.plugin.add(enterKey);
Editor.plugin.add(shiftEnterKey);
Editor.plugin.add(backspaceKey);
Editor.plugin.add(deleteKey);
Editor.plugin.add(tabKey);
Editor.plugin.add(arrowKeys);
Editor.plugin.add(markdown);

export {
  Editor,
  BoxComponent,
  Utils,
  Nodes,
  Fragment,
  Range,
  Box,
  HTMLParser,
  TextParser,
};
