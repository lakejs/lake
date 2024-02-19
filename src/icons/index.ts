// These icons are from Phosphor Icons.

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
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

type IconItem = {
  name: string,
  node: NativeNode,
  title: string,
};

const iconList: IconItem[] = [
  {
    'name': 'undo',
    'node': undo(),
    'title': 'Undo',
  },
  {
    'name': 'redo',
    'node': redo(),
    'title': 'Redo',
  },
  {
    'name': 'blockQuote',
    'node': blockQuote(),
    'title': 'Block quote',
  },
  {
    'name': 'numberedList',
    'node': numberedList(),
    'title': 'Numbered List',
  },
  {
    'name': 'bulletedList',
    'node': bulletedList(),
    'title': 'Bulleted List',
  },
  {
    'name': 'checklist',
    'node': checklist(),
    'title': 'Checklist',
  },
  {
    'name': 'alignLeft',
    'node': alignLeft(),
    'title': 'Align Left',
  },
  {
    'name': 'alignCenter',
    'node': alignCenter(),
    'title': 'Align Center',
  },
  {
    'name': 'alignRight',
    'node': alignRight(),
    'title': 'Align Right',
  },
  {
    'name': 'alignJustify',
    'node': alignJustify(),
    'title': 'Align Justify',
  },
  {
    'name': 'increaseIndent',
    'node': increaseIndent(),
    'title': 'Increase Indent',
  },
  {
    'name': 'decreaseIndent',
    'node': decreaseIndent(),
    'title': 'Decrease Indent',
  },
  {
    'name': 'formatPainter',
    'node': formatPainter(),
    'title': 'Format Painter',
  },
  {
    'name': 'bold',
    'node': bold(),
    'title': 'Bold',
  },
  {
    'name': 'italic',
    'node': italic(),
    'title': 'Italic',
  },
  {
    'name': 'underline',
    'node': underline(),
    'title': 'Underline',
  },
  {
    'name': 'strikethrough',
    'node': strikethrough(),
    'title': 'Strikethrough',
  },
  {
    'name': 'code',
    'node': code(),
    'title': 'Code',
  },
  {
    'name': 'removeFormat',
    'node': removeFormat(),
    'title': 'Remove Format',
  },
  {
    'name': 'hr',
    'node': hr(),
    'title': 'Horizontal Line',
  },
  {
    'name': 'link',
    'node': link(),
    'title': 'Link',
  },
  {
    'name': 'image',
    'node': image(),
    'title': 'Image',
  },
  {
    'name': 'codeBlock',
    'node': codeBlock(),
    'title': 'Code Block',
  },
  {
    'name': 'table',
    'node': table(),
    'title': 'Table',
  },
];

const iconMap: Map<string, IconItem> = new Map();

iconList.forEach(item => {
  iconMap.set(item.name, item);
});

export const icons = iconMap;
