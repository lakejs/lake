import type { BaseTranslation } from '../types';
import { modifierText } from '../../utils/modifier-text';

export default {
  toolbar: {
    undo: `Undo (${modifierText('mod+Z')})`,
    redo: `Redo (${modifierText('mod+Y')})`,
    selectAll: `Select all (${modifierText('mod+A')})`,
    paragraph: 'Paragraph',
    blockQuote: 'Block quotation',
    numberedList: 'Numbered list',
    bulletedList: 'Bulleted list',
    checklist: 'Checklist',
    alignLeft: 'Align left',
    alignCenter: 'Align center',
    alignRight: 'Align right',
    alignJustify: 'Justify',
    increaseIndent: 'Increase indent',
    decreaseIndent: 'Decrease indent',
    bold: `Bold (${modifierText('mod+B')})`,
    italic: `Italic (${modifierText('mod+I')})`,
    underline: `Underline (${modifierText('mod+U')})`,
    strikethrough: 'Strikethrough',
    superscript: 'Superscript',
    subscript: 'Subscript',
    code: 'Inline code',
    removeFormat: 'Remove format',
    formatPainter: 'Format painter',
    link: 'Link',
    hr: 'Horizontal line',
    video: 'YouTube',
    codeBlock: 'Code block',
    heading: 'Heading',
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    heading4: 'Heading 4',
    heading5: 'Heading 5',
    heading6: 'Heading 6',
    list: 'List',
    table: 'Table',
    align: 'Alignment',
    indent: 'Indent',
    fontFamily: 'Font family',
    fontSize: 'Font size',
    moreStyle: 'More style',
    fontColor: 'Font color',
    highlight: 'Highlight',
    image: 'Image',
    file: 'File',
    emoji: 'Emoji',
    equation: 'Mathematical formula',
    twitter: 'X (Tweet)',
    removeColor: 'Remove color',
  },
  slash: {
    heading1: 'Heading 1',
    heading1Desc: 'Create a heading level 1',
    heading2: 'Heading 2',
    heading2Desc: 'Create a heading level 2',
    heading3: 'Heading 3',
    heading3Desc: 'Create a heading level 3',
    heading4: 'Heading 4',
    heading4Desc: 'Create a heading level 4',
    heading5: 'Heading 5',
    heading5Desc: 'Create a heading level 5',
    heading6: 'Heading 6',
    heading6Desc: 'Create a heading level 6',
    paragraph: 'Paragraph',
    paragraphDesc: 'Create a paragraph',
    blockQuote: 'Block quotation',
    blockQuoteDesc: 'Create a block quotation',
    numberedList: 'Numbered list',
    numberedListDesc: 'Create a numbered list',
    bulletedList: 'Bulleted list',
    bulletedListDesc: 'Create a bulleted list',
    checklist: 'Checklist',
    checklistDesc: 'Create a checklist',
    table: 'Table',
    tableDesc: 'Insert a table',
    infoAlert: 'Info alert',
    infoAlertDesc: 'Create an info alert',
    tipAlert: 'Tip alert',
    tipAlertDesc: 'Create a tip alert',
    warningAlert: 'Warning alert',
    warningAlertDesc: 'Create a warning alert',
    dangerAlert: 'Danger alert',
    dangerAlertDesc: 'Create a danger alert',
    hr: 'Horizontal line',
    hrDesc: 'Insert a horizontal line',
    codeBlock: 'Code block',
    codeBlockDesc: 'Insert a code block',
    video: 'YouTube',
    videoDesc: 'Insert a video from YouTube',
    equation: 'Mathematical formula',
    equationDesc: 'Insert a TeX expression',
    twitter: 'Tweet',
    twitterDesc: 'Insert a post from X (Twitter)',
    image: 'Image',
    imageDesc: 'Upload an image',
    file: 'File',
    fileDesc: 'Upload a file',
  },
  link: {
    newLink: 'New link',
    url: 'Link URL',
    title: 'Text to display',
    copy: 'Copy link to clipboard',
    open: 'Open link in new tab',
    save: 'Save',
    unlink: 'Remove link',
  },
  table: {
    fitTable: 'Fit table to page width',
    cellBackground: 'Cell background color',
    column: 'Column',
    insertColumnLeft: 'Insert column left',
    insertColumnRight: 'Insert column right',
    deleteColumn: 'Delete column',
    row: 'Row',
    insertRowAbove: 'Insert row above',
    insertRowBelow: 'Insert row below',
    deleteRow: 'Delete row',
    merge: 'Merge cells',
    mergeUp: 'Merge cell up',
    mergeRight: 'Merge cell right',
    mergeDown: 'Merge cell down',
    mergeLeft: 'Merge cell left',
    split: 'Split cell',
    splitLeftRight: 'Split cell left and right',
    splitTopBottom: 'Split cell top and bottom',
    remove: 'Remove table',
  },
  image: {
    view: 'Full screen',
    remove: 'Delete',
    previous: 'Previous',
    next: 'Next',
    close: 'Close (Esc)',
    loadingError: 'Unable to load image.',
    zoomOut: 'Zoom out',
    zoomIn: 'Zoom in',
    align: 'Alignment',
    alignLeft: 'Align left',
    alignCenter: 'Align center',
    alignRight: 'Align right',
    resize: 'Resize image',
    pageWidth: 'Page width',
    originalWidth: 'Original image width',
    imageWidth: '{0} image width',
    open: 'Open image in new tab',
    caption: 'Caption',
    captionPlaceholder: 'Write a caption...',
  },
  file: {
    download: 'Download',
    remove: 'Delete',
  },
  video: {
    embed: 'Embed video',
    remove: 'Delete',
    description: 'Paste a link to embed a video from YouTube.',
    url: 'Link',
    urlError: 'Please enter a valid link.',
  },
  codeBlock: {
    langType: 'Select language',
  },
  equation: {
    save: 'Done',
    help: 'Supported functions',
    placeholder: 'Type a TeX expression...',
  },
  twitter: {
    embed: 'Embed Tweet',
    remove: 'Delete',
    description: 'Paste a link to embed a post from X.',
    url: 'Link',
    urlError: 'Please enter a valid link.',
  },
} satisfies BaseTranslation;
