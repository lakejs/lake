// These icons are from open source projects.
//
// Fluent Icons by Microsoft (https://fluenticons.co/).
// - superscript.svg
// - subscript.svg
// - more-style.svg
// - block-quote.svg
//
// Phosphor Icons (https://phosphoricons.com/).
// - other icons

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// basic
import plus from './plus.svg';
import more from './more.svg';
import down from './down.svg';
import check from './check.svg';
import selectAll from './select-all.svg';
import undo from './undo.svg';
import redo from './redo.svg';
// block format
import blockQuote from './block-quote.svg';
import list from './list.svg';
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
import superscript from './superscript.svg';
import subscript from './subscript.svg';
import code from './code.svg';
import removeFormat from './remove-format.svg';
import moreStyle from './more-style.svg';
import fontColor from './font-color.svg';
import fontColorAccent from './font-color-accent.svg';
import highlight from './highlight.svg';
import highlightAccent from './highlight-accent.svg';
// items that can be inserted
import hr from './hr.svg';
import link from './link.svg';
import image from './image.svg';
import codeBlock from './code-block.svg';
import table from './table.svg';

export const icons: Map<string, string> = new Map([
  ['plus', plus],
  ['more', more],
  ['down', down],
  ['check', check],
  ['selectAll', selectAll],
  ['undo', undo],
  ['redo', redo],
  ['blockQuote', blockQuote],
  ['list', list],
  ['numberedList', numberedList],
  ['bulletedList', bulletedList],
  ['checklist', checklist],
  ['alignLeft', alignLeft],
  ['alignCenter', alignCenter],
  ['alignRight', alignRight],
  ['alignJustify', alignJustify],
  ['increaseIndent', increaseIndent],
  ['decreaseIndent', decreaseIndent],
  ['formatPainter', formatPainter],
  ['bold', bold],
  ['italic', italic],
  ['underline', underline],
  ['strikethrough', strikethrough],
  ['superscript', superscript],
  ['subscript', subscript],
  ['code', code],
  ['removeFormat', removeFormat],
  ['moreStyle', moreStyle],
  ['fontColor', fontColor],
  ['fontColorAccent', fontColorAccent],
  ['highlight', highlight],
  ['highlightAccent', highlightAccent],
  ['hr', hr],
  ['link', link],
  ['image', image],
  ['codeBlock', codeBlock],
  ['table', table],
]);
