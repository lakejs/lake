import { Editor, Toolbar, ToolbarItem, DropdownMenuItem, icons } from '../src';

const emojiItems = [
  { value: 'face_blowing_a_kiss_color.svg', text: 'Face blowing a kiss' },
  { value: 'face_exhaling_color.svg', text: 'Face exhaling' },
  { value: 'face_holding_back_tears_color.svg', text: 'Face holding back tears' },
  { value: 'face_in_clouds_color.svg', text: 'Face in clouds' },
];

const emojiMenuItems: DropdownMenuItem[] = [];
for (const item of emojiItems) {
  emojiMenuItems.push({
    icon: `<img src="../assets/emojis/${item.value}" alt="${item.text}" title="${item.text}" />`,
    value: item.value,
    text: item.text,
  });
}

const emoji: ToolbarItem = {
  name: 'emoji',
  type: 'dropdown',
  downIcon: icons.get('down'),
  icon: icons.get('emoji'),
  defaultValue: '',
  tooltip: 'Emoji',
  width: 'auto',
  menuType: 'icon',
  menuItems: emojiMenuItems,
  onSelect: (editor, value) => {
    const currentItem = emojiItems.find(item => item.value === value);
    if (!currentItem) {
      return;
    }
    editor.command.execute('emoji', {
      url: `../assets/emojis/${currentItem.value}`,
      title: currentItem.text,
    });
  },
};

const toolbarItems = [
  'undo',
  'redo',
  '|',
  'heading',
  'fontFamily',
  'fontSize',
  '|',
  'formatPainter',
  'removeFormat',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'superscript',
  'subscript',
  'code',
  'moreStyle',
  '|',
  'fontColor',
  'highlight',
  '|',
  'list',
  'numberedList',
  'bulletedList',
  'checklist',
  '|',
  'align',
  'alignLeft',
  'alignCenter',
  'alignRight',
  'alignJustify',
  '|',
  'indent',
  'increaseIndent',
  'decreaseIndent',
  '|',
  'link',
  'image',
  'video',
  'file',
  emoji,
  'codeBlock',
  'blockQuote',
  'paragraph',
  'hr',
  '|',
  'selectAll',
];

export default (value: string) => {
  const toolbar = new Toolbar({
    root: '.lake-toolbar-root',
    items: toolbarItems,
  });
  const editor = new Editor({
    root: '.lake-root',
    toolbar,
    lang: window.LAKE_LANGUAGE,
    value,
    onMessage: (type, message) => {
      if (type === 'error') {
        // eslint-disable-next-line no-alert
        window.alert(message);
      } else {
        // eslint-disable-next-line no-console
        console.log(message);
      }
    },
    image: {
      // requestMethod: 'GET',
      // requestAction: '/assets/json/upload-image.json',
      requestAction: '/upload',
    },
    file: {
      requestAction: '/upload',
    },
    codeBlock: {
      // langList: ['text', 'html'],
    },
  });
  editor.render();
  return editor;
};
