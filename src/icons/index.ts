// These icons are from Phosphor Icons.

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { NativeNode } from '../types/native';
// basic
import plus from './plus.svg';
import more from './more.svg';
import down from './down.svg';
// history
import undo from './undo.svg';
import redo from './redo.svg';
// block format
import blockQuote from './block-quote.svg';
import numberedList from './numbered-list.svg';
import bulletedList from './bulleted-list.svg';
import checklist from './checklist.svg';
import alignLeft from './align-left.svg';
import alignCenter from './align-center.svg';
import alignRight from './align-right.svg';
import alignJustify from './align-justify.svg';
import increaseIndent from './increase-indent.svg';
import decreaseIndent from './decrease-indent.svg';
// mark format
import formatPainter from './format-painter.svg';
import bold from './bold.svg';
import italic from './italic.svg';
import underline from './underline.svg';
import strikethrough from './strikethrough.svg';
import code from './code.svg';
import removeFormat from './remove-format.svg';
// items that can be inserted
import hr from './hr.svg';
import link from './link.svg';
import image from './image.svg';
import codeBlock from './code-block.svg';
import table from './table.svg';

export const icons: Map<string, NativeNode> = new Map([
  ['plus', plus()],
  ['more', more()],
  ['down', down()],
  ['undo', undo()],
  ['redo', redo()],
  ['blockQuote', blockQuote()],
  ['numberedList', numberedList()],
  ['bulletedList', bulletedList()],
  ['checklist', checklist()],
  ['alignLeft', alignLeft()],
  ['alignCenter', alignCenter()],
  ['alignRight', alignRight()],
  ['alignJustify', alignJustify()],
  ['increaseIndent', increaseIndent()],
  ['decreaseIndent', decreaseIndent()],
  ['formatPainter', formatPainter()],
  ['bold', bold()],
  ['italic', italic()],
  ['underline', underline()],
  ['strikethrough', strikethrough()],
  ['code', code()],
  ['removeFormat', removeFormat()],
  ['hr', hr()],
  ['link', link()],
  ['image', image()],
  ['codeBlock', codeBlock()],
  ['table', table()],
]);
