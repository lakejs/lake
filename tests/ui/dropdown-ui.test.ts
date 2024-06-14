import { debug, query } from '../../src/utils';
import { Dropdown } from '../../src/ui/dropdown';
import { DropdownMenuItem, Nodes, icons } from '../../src';

const  headingMenuItems = [
  {
    value: 'h1',
    text: '<span style="font-weight: bold; font-size: 26px;">Heading 1</span>',
  },
  {
    value: 'h2',
    text: '<span style="font-weight: bold; font-size: 24px;">Heading 2</span>',
  },
  {
    value: 'h3',
    text: '<span style="font-weight: bold; font-size: 22px;">Heading 3</span>',
  },
  {
    value: 'p',
    text: 'Paragraph',
  },
];


const alignMenuItems = [
  {
    icon: icons.get('alignLeft'),
    value: 'left',
    text: 'Align left',
  },
  {
    icon: icons.get('alignCenter'),
    value: 'center',
    text: 'Align center',
  },
  {
    icon: icons.get('alignRight'),
    value: 'right',
    text: 'Align right',
  },
  {
    icon: icons.get('alignJustify'),
    value: 'justify',
    text: 'Align justify',
  },
];

const moreStyleMenuItems = [
  {
    icon: icons.get('italic'),
    value: 'italic',
    text: 'Italic',
  },
  {
    icon: icons.get('underline'),
    value: 'underline',
    text: 'Underline',
  },
  {
    icon: icons.get('strikethrough'),
    value: 'strikethrough',
    text: 'Strikethrough',
  },
];

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

const colors: string[] = [
  '#E53333', '#E56600', '#FF9900', '#64451D', '#DFC5A4', '#FFE500',
  '#009900', '#006600', '#99BB00', '#B8D100', '#60D978', '#00D5FF',
  '#337FE5', '#003399', '#4C33E5', '#9933E5', '#CC33E5', '#EE33EE',
  '#FFFFFF', '#CCCCCC', '#999999', '#666666', '#333333', '#000000',
];
const colorMenuItems = [
  {
    value: '',
    text: 'Remove color',
  },
];
for (const color of colors) {
  colorMenuItems.push({
    value: color.toLowerCase(),
    text: color.toUpperCase(),
  });
}

describe('ui / dropdown-ui', () => {

  let rootNode: Nodes;

  before(()=> {
    rootNode = query('<div class="lake-dropdown-root lake-custom-properties" />');
    query(document.body).append(rootNode);
  });

  it('heading dropdown', () => {
    const dropdown = new Dropdown({
      root: rootNode,
      name: 'heading',
      downIcon: icons.get('down'),
      defaultValue: 'p',
      tooltip: 'Heading',
      width: '100px',
      menuType: 'list',
      menuItems: headingMenuItems,
      onSelect: value => {
        debug(value);
      },
    });
    dropdown.render();
  });

  it('heading dropdown: disabled status', () => {
    const dropdown = new Dropdown({
      root: rootNode,
      name: 'heading',
      downIcon: icons.get('down'),
      defaultValue: 'p',
      tooltip: 'Heading',
      width: '100px',
      menuType: 'list',
      menuItems: headingMenuItems,
      onSelect: value => {
        debug(value);
      },
    });
    dropdown.render();
    dropdown.node.attr('disabled', 'true');
  });

  it('align dropdown: placement is top', () => {
    const dropdown = new Dropdown({
      root: rootNode,
      name: 'align',
      icon: icons.get('alignLeft'),
      downIcon: icons.get('down'),
      tooltip: 'Alignment',
      menuType: 'list',
      menuItems: alignMenuItems,
      placement: 'top',
      onSelect: value => {
        debug(value);
      },
    });
    dropdown.render();
  });

  it('align dropdown: disabled status', () => {
    const dropdown = new Dropdown({
      root: rootNode,
      name: 'align',
      icon: icons.get('alignLeft'),
      downIcon: icons.get('down'),
      tooltip: 'Alignment',
      menuType: 'list',
      menuItems: alignMenuItems,
      onSelect: value => {
        debug(value);
      },
    });
    dropdown.render();
    dropdown.node.attr('disabled', 'true');
  });

  it('moreStyle dropdown', () => {
    const dropdown = new Dropdown({
      root: rootNode,
      name: 'moreStyle',
      icon: icons.get('more'),
      tooltip: 'More style',
      menuType: 'list',
      menuItems: moreStyleMenuItems,
      onSelect: value => {
        debug(value);
      },
    });
    dropdown.render();
  });

  it('emoji dropdown', () => {
    const dropdown = new Dropdown({
      root: rootNode,
      name: 'emoji',
      downIcon: icons.get('down'),
      icon: icons.get('emoji'),
      tooltip: 'Emoji',
      menuType: 'icon',
      menuItems: emojiMenuItems,
      menuWidth: '264px',
      onSelect: value => {
        debug(value);
      },
    });
    dropdown.render();
  });

  it('color dropdown', () => {
    const dropdown = new Dropdown({
      root: rootNode,
      name: 'fontColor',
      icon: icons.get('fontColor'),
      accentIcon: icons.get('fontColorAccent'),
      downIcon: icons.get('down'),
      defaultValue: '#e53333',
      tooltip: 'Color',
      menuType: 'color',
      menuItems: colorMenuItems,
      menuWidth: '156px',
      onSelect: value => {
        debug(value);
      },
    });
    dropdown.render();
  });

  it('color dropdown: disabled status', () => {
    const dropdown = new Dropdown({
      root: rootNode,
      name: 'fontColor',
      icon: icons.get('fontColor'),
      accentIcon: icons.get('fontColorAccent'),
      downIcon: icons.get('down'),
      defaultValue: '#e53333',
      tooltip: 'Color',
      menuType: 'color',
      menuItems: colorMenuItems,
      menuWidth: '156px',
      onSelect: value => {
        debug(value);
      },
    });
    dropdown.render();
    dropdown.node.attr('disabled', 'true');
  });

});
