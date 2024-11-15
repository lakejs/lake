import './css';
import './elements/box';
import './elements/bookmark';
import { BoxComponent, BoxValue } from './types/box';
import { ToolbarItem } from './types/toolbar';
import { DropdownMenuItem } from './types/dropdown';
import { MentionItem } from './types/mention';
import { SlashItem } from './types/slash';
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
import { insertContents} from './operations/insert-contents';
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
import hrBox from './boxes/hr';
import codeBlockBox from './boxes/code-block';
import imageBox from './boxes/image';
import videoBox from './boxes/video';
import fileBox from './boxes/file';
import emojiBox from './boxes/emoji';
import equationBox from './boxes/equation';
import mentionBox from './boxes/mention';
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
import codeBlock from './plugins/code-block';
import image from './plugins/image';
import video from './plugins/video';
import file from './plugins/file';
import emoji from './plugins/emoji';
import equation from './plugins/equation';
import specialCharacter from './plugins/special-character';
import mention from './plugins/mention';
import table from './plugins/table';
import markdown from './plugins/markdown';
import enterKey from './plugins/enter-key';
import shiftEnterKey from './plugins/shift-enter-key';
import backspaceKey from './plugins/backspace-key';
import deleteKey from './plugins/delete-key';
import tabKey from './plugins/tab-key';
import arrowKeys from './plugins/arrow-keys';
import escapeKey from './plugins/escape-key';
import slash from './plugins/slash';

Editor.box.add(hrBox);
Editor.box.add(codeBlockBox);
Editor.box.add(imageBox);
Editor.box.add(videoBox);
Editor.box.add(fileBox);
Editor.box.add(emojiBox);
Editor.box.add(equationBox);
Editor.box.add(mentionBox);

Editor.plugin.add('copy', copy);
Editor.plugin.add('cut', cut);
Editor.plugin.add('paste', paste);
Editor.plugin.add('drop', drop);
Editor.plugin.add('undo', undo);
Editor.plugin.add('redo', redo);
Editor.plugin.add('selectAll', selectAll);
Editor.plugin.add('heading', heading);
Editor.plugin.add('blockQuote', blockQuote);
Editor.plugin.add('list', list);
Editor.plugin.add('align', align);
Editor.plugin.add('indent', indent);
Editor.plugin.add('bold', bold);
Editor.plugin.add('italic', italic);
Editor.plugin.add('underline', underline);
Editor.plugin.add('strikethrough', strikethrough);
Editor.plugin.add('subscript', subscript);
Editor.plugin.add('superscript', superscript);
Editor.plugin.add('code', code);
Editor.plugin.add('fontFamily', fontFamily);
Editor.plugin.add('fontSize', fontSize);
Editor.plugin.add('fontColor', fontColor);
Editor.plugin.add('highlight', highlight);
Editor.plugin.add('removeFormat', removeFormat);
Editor.plugin.add('formatPainter', formatPainter);
Editor.plugin.add('link', link);
Editor.plugin.add('hr', hr);
Editor.plugin.add('codeBlock', codeBlock);
Editor.plugin.add('image', image);
Editor.plugin.add('video', video);
Editor.plugin.add('file', file);
Editor.plugin.add('emoji', emoji);
Editor.plugin.add('equation', equation);
Editor.plugin.add('specialCharacter', specialCharacter);
Editor.plugin.add('mention', mention);
Editor.plugin.add('table', table);
Editor.plugin.add('markdown', markdown);
Editor.plugin.add('enterKey', enterKey);
Editor.plugin.add('shiftEnterKey', shiftEnterKey);
Editor.plugin.add('backspaceKey', backspaceKey);
Editor.plugin.add('deleteKey', deleteKey);
Editor.plugin.add('tabKey', tabKey);
Editor.plugin.add('arrowKeys', arrowKeys);
Editor.plugin.add('escapeKey', escapeKey);
Editor.plugin.add('slash', slash);

export {
  Editor,
  Toolbar,
  ToolbarItem,
  DropdownMenuItem,
  MentionItem,
  SlashItem,
  BoxComponent,
  BoxValue,
  Button,
  Dropdown,
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
  insertContents,
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
};
