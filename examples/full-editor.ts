import { Editor, Toolbar, ToolbarItem, DropdownMenuItem, MentionItem,  SlashItem, icons } from 'lakelib';

// These emojis are sourced from Fluent Emoji.
// https://github.com/microsoft/fluentui-emoji
const emojiItems = [
  { value: 'face_blowing_a_kiss_color.svg', text: 'Face blowing a kiss' },
  { value: 'face_exhaling_color.svg', text: 'Face exhaling' },
  { value: 'face_holding_back_tears_color.svg', text: 'Face holding back tears' },
  { value: 'face_in_clouds_color.svg', text: 'Face in clouds' },
  { value: 'face_savoring_food_color.svg', text: 'Face savoring food' },
  { value: 'face_screaming_in_fear_color.svg', text: 'Face screaming in fear' },
  { value: 'face_vomiting_color.svg', text: 'Face vomiting' },
  { value: 'face_with_diagonal_mouth_color.svg', text: 'Face with diagonal mouth' },
  { value: 'face_with_hand_over_mouth_color.svg', text: 'Face with hand over mouth' },
  { value: 'face_with_head-bandage_color.svg', text: 'Face with head-bandage' },
  { value: 'face_with_medical_mask_color.svg', text: 'Face with medical mask' },
  { value: 'face_with_monocle_color.svg', text: 'Face with monocle' },
  { value: 'face_with_open_eyes_and_hand_over_mouth_color.svg', text: 'Face with open eyes and hand over mouth' },
  { value: 'face_with_open_mouth_color.svg', text: 'Face with open mouth' },
  { value: 'face_with_peeking_eye_color.svg', text: 'Face with peeking eye' },
  { value: 'face_with_raised_eyebrow_color.svg', text: 'Face with raised eyebrow' },
  { value: 'face_with_rolling_eyes_color.svg', text: 'Face with rolling eyes' },
  { value: 'face_with_spiral_eyes_color.svg', text: 'Face with spiral eyes' },
  { value: 'face_with_steam_from_nose_color.svg', text: 'Face with steam from nose' },
  { value: 'face_with_symbols_on_mouth_color.svg', text: 'Face with symbols on mouth' },
  { value: 'face_with_tears_of_joy_color.svg', text: 'Face with tears of joy' },
  { value: 'face_with_thermometer_color.svg', text: 'Face with thermometer' },
  { value: 'face_with_tongue_color.svg', text: 'Face with tongue' },
  { value: 'face_without_mouth_color.svg', text: 'Face without mouth' },
];

const emojiMenuItems: DropdownMenuItem[] = [];
for (const item of emojiItems) {
  emojiMenuItems.push({
    icon: `<img src="../assets/emojis/${item.value}" alt="${item.text}" title="${item.text}" />`,
    value: item.value,
    text: item.text,
  });
}

// https://unicode.org/emoji/charts/full-emoji-list.html
const specialCharacterItems: DropdownMenuItem[] = [
  { value: '😃', text: 'Grinning face with big eyes' },
  { value: '😁', text: 'Beaming face with smiling eyes' },
  { value: '😂', text: 'Face with tears of joy' },
  { value: '😉', text: 'Winking face' },
  { value: '😊', text: 'Smiling face with smiling eyes' },
  { value: '😍', text: 'Smiling face with heart-eyes' },
  { value: '😘', text: 'Face blowing a kiss' },
  { value: '😚', text: 'Kissing face with closed eyes' },
  { value: '😜', text: 'Winking face with tongue' },
  { value: '😏', text: 'Smirking face' },
  { value: '😒', text: 'Unamused face' },
  { value: '😌', text: 'Relieved face' },
  { value: '😔', text: 'Pensive face' },
  { value: '😪', text: 'Sleepy face' },
  { value: '😷', text: 'Face with medical mask' },
  { value: '😵', text: 'Face with crossed-out eyes' },
  { value: '😲', text: 'Astonished face' },
  { value: '😳', text: 'Flushed face' },

  { value: '😨', text: 'Fearful face' },
  { value: '😰', text: 'Anxious face with sweat' },
  { value: '😢', text: 'Crying face' },
  { value: '😭', text: 'Loudly crying face' },
  { value: '😱', text: 'Face screaming in fear' },
  { value: '😖', text: 'Confounded face' },
  { value: '😣', text: 'Persevering face' },
  { value: '😓', text: 'Downcast face with sweat' },
  { value: '😩', text: 'Weary face' },
  { value: '😫', text: 'Tired face' },
  { value: '😤', text: 'Face with steam from nose' },
  { value: '😡', text: 'Enraged face' },
  { value: '😠', text: 'Angry face' },
  { value: '👿', text: 'Angry face with horns' },
  { value: '💀', text: 'Skull' },
  { value: '💩', text: 'Pile of poo' },
  { value: '👹', text: 'Ogre' },
  { value: '👺', text: 'Goblin' },

  { value: '💌', text: 'Love letter' },
  { value: '💘', text: 'Heart with arrow' },
  { value: '💝', text: 'Heart with ribbon' },
  { value: '💖', text: 'Sparkling heart' },
  { value: '💓', text: 'Beating heart' },
  { value: '💞', text: 'Revolving hearts' },
  { value: '💕', text: 'Two hearts' },
  { value: '💔', text: 'Broken heart' },
  { value: '💛', text: 'Yellow heart' },
  { value: '💚', text: 'Green heart' },
  { value: '💙', text: 'Blue heart' },
  { value: '💜', text: 'Purple heart' },
  { value: '💋', text: 'Kiss mark' },
  { value: '💯', text: 'Hundred points' },
  { value: '💢', text: 'Anger symbol' },
  { value: '💥', text: 'Collision' },
  { value: '💫', text: 'Dizzy' },
  { value: '💦', text: 'Sweat droplets' },

  { value: '💨', text: 'Dashing away' },
  { value: '💤', text: 'ZZZ' },
  { value: '👋', text: 'Waving hand' },
  { value: '✋', text: 'Raised hand' },
  { value: '👌', text: 'OK hand' },
  { value: '✌', text: 'Victory hand' },
  { value: '👈', text: 'Backhand index pointing left' },
  { value: '👉', text: 'Backhand index pointing right' },
  { value: '👆', text: 'Backhand index pointing up' },
  { value: '👇', text: 'Backhand index pointing down' },
  { value: '☝', text: 'Index pointing up' },
  { value: '👍', text: 'Thumbs up' },
  { value: '👎', text: 'Thumbs down' },
  { value: '✊', text: 'Raised fist' },
  { value: '👊', text: 'Oncoming fist' },
  { value: '👏', text: 'Clapping hands' },
  { value: '🙏', text: 'Folded hands' },
  { value: '💪', text: 'Flexed biceps' },

  { value: '👶', text: 'Baby' },
  { value: '👨', text: 'Man' },
  { value: '👩', text: 'Woman' },
  { value: '👴', text: 'Old man' },
  { value: '👵', text: 'Old woman' },
  { value: '🙍', text: 'Person frowning' },
  { value: '🙎', text: 'Person pouting' },
  { value: '🙅', text: 'Person gesturing NO' },
  { value: '🙆', text: 'Person gesturing OK' },
  { value: '🙋', text: 'Person raising hand' },
  { value: '🙇', text: 'Person bowing' },
  { value: '👮', text: 'Police officer' },
  { value: '👷', text: 'Construction worker' },
  { value: '⬛', text: 'Black large square' },
  { value: '⬜', text: 'White large square' },
  { value: '⚫', text: 'Black circle' },
  { value: '✅', text: 'Check mark button' },
  { value: '❌', text: 'Cross mark' },

  { value: '$', text: 'Dollar' },
  { value: '€', text: 'Euro' },
  { value: '£', text: 'Pound' },
  { value: '¥', text: 'Yuan / Yen' },
  { value: '₩', text: 'Won' },
  { value: '₿', text: 'Bitcoin' },
  { value: '←', text: 'Leftwards' },
  { value: '→', text: 'Rightwards' },
  { value: '↑', text: 'Upwards' },
  { value: '↓', text: 'Downwards' },
  { value: '±', text: 'Plus-minus' },
  { value: '÷', text: 'Division' },
  { value: '≤', text: 'Less-than or equal to' },
  { value: '≥', text: 'Greater-than or equal to' },
  { value: '≠', text: 'Not equal to' },
  { value: '≈', text: 'Almost equal to' },
  { value: '∞', text: 'Infinity' },
  { value: '∠', text: 'Angle' },
];

const emoji: ToolbarItem = {
  name: 'emoji',
  type: 'dropdown',
  downIcon: icons.get('down'),
  icon: icons.get('emoji'),
  tooltip: 'Emoji',
  menuType: 'icon',
  menuItems: emojiMenuItems,
  menuWidth: '264px',
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

const specialCharacter: ToolbarItem = {
  name: 'specialCharacter',
  type: 'dropdown',
  downIcon: icons.get('down'),
  icon: icons.get('specialCharacter'),
  tooltip: 'Special character',
  menuType: 'character',
  menuItems: specialCharacterItems,
  menuWidth: '270px',
  menuHeight: '180px',
  onSelect: (editor, value) => {
    editor.command.execute('specialCharacter', value);
  },
};

const helloWorld: ToolbarItem = {
  name: 'helloWorld',
  type: 'button',
  icon: '<img src="../assets/icons/hand-waving.svg" />',
  tooltip: 'Hello World',
  onClick: editor => {
    editor.command.execute('helloWorld');
  },
};

const helloWorldSlashItem: SlashItem = {
  name: 'helloWorld',
  type: 'button',
  icon: '<img src="../assets/icons/hand-waving.svg" />',
  title: 'Hello World',
  description: 'Insert an example box',
  onClick: (editor, value) => {
    editor.command.execute(value);
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
  'table',
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
  specialCharacter,
  'codeBlock',
  'equation',
  'blockQuote',
  'paragraph',
  'hr',
  '|',
  'selectAll',
  helloWorld,
];

const slashItems: (string | SlashItem)[] = [
  helloWorldSlashItem,
  'image',
  'file',
  'heading1',
  'heading2',
  'heading3',
  'heading4',
  'heading5',
  'heading6',
  'paragraph',
  'blockQuote',
  'numberedList',
  'bulletedList',
  'checklist',
  'table',
  'infoAlert',
  'tipAlert',
  'warningAlert',
  'dangerAlert',
  'hr',
  'codeBlock',
  'video',
  'equation',
];

const mentionItems: MentionItem[] = [
  {
    id: '1',
    name: 'luolonghao',
    nickname: 'Roddy',
    avatar: '<img src="../assets/images/universal-studios-240.jpg" />',
  },
  {
    id: '2',
    name: 'heavenlake',
    nickname: 'Heaven Lake',
    avatar: '<img src="../assets/images/heaven-lake-256.png" />',
  },
  {
    id: '3',
    name: 'lacgentau',
    nickname: 'Lac Gentau',
    avatar: '<img src="../assets/images/lac-gentau-256.jpg" />',
  },
  {
    id: '4',
    name: 'universalstudios',
    nickname: 'Universal Studios',
    avatar: '<img src="../assets/images/universal-studios-240.jpg" />',
  },
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
      } if (type === 'warning') {
        // eslint-disable-next-line no-console
        console.warn(message);
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
    slash: {
      items: slashItems,
    },
    mention: {
      items: mentionItems,
      requestMethod: 'GET',
      requestAction: '../assets/json/mention.json',
    },
  });
  editor.render();
  return editor;
};
