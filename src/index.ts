import './css';
import './elements/box';
import './elements/bookmark';
import { BoxComponent } from './types/box';
import { ToolbarItem } from './types/toolbar';
import { icons } from './icons';
import * as Utils from './utils';
import { Nodes } from './models/nodes';
import { Fragment } from './models/fragment';
import { Range } from './models/range';
import { Box } from './models/box';
import { HTMLParser } from './parsers/html-parser';
import { TextParser } from './parsers/text-parser';
import { insertBookmark } from './operations/insert-bookmark';
import { toBookmark } from './operations/to-bookmark';
import { insertNode } from './operations/insert-node';
import { insertFragment} from './operations/insert-fragment';
import { deleteContents} from './operations/delete-contents';
import { setBlocks} from './operations/set-blocks';
import { splitBlock} from './operations/split-block';
import { splitMarks} from './operations/split-marks';
import { addMark} from './operations/add-mark';
import { removeMark} from './operations/remove-mark';
import { fixList} from './operations/fix-list';
import { insertLink } from './operations/insert-link';
import { insertBox } from './operations/insert-box';
import { removeBox } from './operations/remove-box';
import { Button } from './ui/button';
import { Dropdown } from './ui/dropdown';
import { Editor } from './editor';
import { Toolbar } from './ui/toolbar';
import { hrBox } from './boxes/hr';
import { videoBox } from './boxes/video';
import { codeBlockBox } from './boxes/code-block';
import { imageBox } from './boxes/image';
import { fileBox } from './boxes/file';
import copy from './plugins/copy';
import cut from './plugins/cut';
import paste from './plugins/paste';
import drop from './plugins/drop';
import undo from './plugins/undo';
import redo from './plugins/redo';
import selectAll from './plugins/select-all';
import heading from './plugins/heading';
import blockQuote from './plugins/block-quote';
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
import hr from './plugins/hr';
import video from './plugins/video';
import codeBlock from './plugins/code-block';
import image from './plugins/image';
import file from './plugins/file';
import markdown from './plugins/markdown';
import enterKey from './plugins/enter-key';
import shiftEnterKey from './plugins/shift-enter-key';
import backspaceKey from './plugins/backspace-key';
import deleteKey from './plugins/delete-key';
import tabKey from './plugins/tab-key';
import arrowKeys from './plugins/arrow-keys';
import escapeKey from './plugins/escape-key';

Editor.box.add(hrBox);
Editor.box.add(videoBox);
Editor.box.add(codeBlockBox);
Editor.box.add(imageBox);
Editor.box.add(fileBox);

Editor.plugin.add(copy);
Editor.plugin.add(cut);
Editor.plugin.add(paste);
Editor.plugin.add(drop);
Editor.plugin.add(undo);
Editor.plugin.add(redo);
Editor.plugin.add(selectAll);
Editor.plugin.add(heading);
Editor.plugin.add(blockQuote);
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
Editor.plugin.add(hr);
Editor.plugin.add(video);
Editor.plugin.add(codeBlock);
Editor.plugin.add(image);
Editor.plugin.add(file);
Editor.plugin.add(markdown);
Editor.plugin.add(enterKey);
Editor.plugin.add(shiftEnterKey);
Editor.plugin.add(backspaceKey);
Editor.plugin.add(deleteKey);
Editor.plugin.add(tabKey);
Editor.plugin.add(arrowKeys);
Editor.plugin.add(escapeKey);

export {
  Editor,
  Toolbar,
  ToolbarItem,
  BoxComponent,
  icons,
  Utils,
  Nodes,
  Fragment,
  Range,
  Box,
  HTMLParser,
  TextParser,
  insertBookmark,
  toBookmark,
  insertNode,
  insertFragment,
  deleteContents,
  setBlocks,
  splitBlock,
  splitMarks,
  addMark,
  removeMark,
  fixList,
  insertLink,
  insertBox,
  removeBox,
  Button,
  Dropdown,
};
