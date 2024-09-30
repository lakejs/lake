import { click } from '../utils';
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

// https://unicode.org/emoji/charts/full-emoji-list.html
const specialCharacterItems = [
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

describe('ui / dropdown', () => {

  let rootNode: Nodes;

  beforeEach(()=> {
    rootNode = query('<div class="lake-dropdown-root" />');
    query(document.body).append(rootNode);
  });

  afterEach(() => {
    rootNode.remove();
  });

  it('text button with list menu: select an item', () => {
    let dropdownValue;
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
        dropdownValue = value;
      },
    });
    dropdown.render();
    const titleNode = dropdown.node.find('.lake-dropdown-title');
    titleNode.emit('mouseenter');
    expect(titleNode.hasClass('lake-dropdown-title-hovered')).to.equal(true);
    titleNode.emit('mouseleave');
    expect(titleNode.hasClass('lake-dropdown-title-hovered')).to.equal(false);
    click(titleNode);
    expect(dropdown.node.find('.lake-dropdown-menu').computedCSS('display')).to.equal('block');
    click(dropdown.node.find('li[value="h3"]'));
    expect(dropdownValue).to.equal('h3');
    expect(dropdown.node.find('.lake-dropdown-menu').computedCSS('display')).to.equal('none');
    dropdown.unmount();
  });

  it('text button with list menu: close menu by clicking document', () => {
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
    const titleNode = dropdown.node.find('.lake-dropdown-title');
    click(titleNode);
    expect(dropdown.node.find('.lake-dropdown-menu').computedCSS('display')).to.equal('block');
    click(query(document.body));
    expect(dropdown.node.find('.lake-dropdown-menu').computedCSS('display')).to.equal('none');
    dropdown.unmount();
  });

  it('text button with list menu: should show menu at the top', () => {
    const dropdown = new Dropdown({
      root: rootNode,
      name: 'heading',
      downIcon: icons.get('down'),
      defaultValue: 'p',
      tooltip: 'Heading',
      width: '100px',
      menuType: 'list',
      menuItems: headingMenuItems,
      direction: 'top',
      onSelect: value => {
        debug(value);
      },
    });
    dropdown.render();
    const titleNode = dropdown.node.find('.lake-dropdown-title');
    click(titleNode);
    expect(dropdown.node.find('.lake-dropdown-menu').computedCSS('top')).to.equal('auto');
    click(query(document.body));
    expect(dropdown.node.find('.lake-dropdown-menu').computedCSS('display')).to.equal('none');
    dropdown.unmount();
  });

  it('text button with list menu: disabled status', () => {
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
    const titleNode = dropdown.node.find('.lake-dropdown-title');
    titleNode.emit('mouseenter');
    expect(titleNode.hasClass('lake-dropdown-title-hovered')).to.equal(false);
    click(titleNode);
    expect(dropdown.node.find('.lake-dropdown-menu').computedCSS('display')).to.equal('none');
    dropdown.unmount();
  });

  it('icon button with list menu: select an item', () => {
    let dropdownValue;
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
        dropdownValue = value;
      },
    });
    dropdown.render();
    const titleNode = dropdown.node.find('.lake-dropdown-title');
    titleNode.emit('mouseenter');
    expect(titleNode.hasClass('lake-dropdown-title-hovered')).to.equal(true);
    titleNode.emit('mouseleave');
    expect(titleNode.hasClass('lake-dropdown-title-hovered')).to.equal(false);
    click(titleNode);
    expect(dropdown.node.find('.lake-dropdown-menu').computedCSS('display')).to.equal('block');
    click(dropdown.node.find('li[value="center"]'));
    expect(dropdownValue).to.equal('center');
    expect(dropdown.node.find('.lake-dropdown-menu').computedCSS('display')).to.equal('none');
    dropdown.unmount();
  });

  it('icon button with list menu: disabled status', () => {
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
    const titleNode = dropdown.node.find('.lake-dropdown-title');
    titleNode.emit('mouseenter');
    expect(titleNode.hasClass('lake-dropdown-title-hovered')).to.equal(false);
    click(titleNode);
    expect(dropdown.node.find('.lake-dropdown-menu').computedCSS('display')).to.equal('none');
    dropdown.unmount();
  });

  it('icon button without down icon: select an item', () => {
    let dropdownValue;
    const dropdown = new Dropdown({
      root: rootNode,
      name: 'moreStyle',
      icon: icons.get('more'),
      tooltip: 'More style',
      menuType: 'list',
      menuItems: moreStyleMenuItems,
      onSelect: value => {
        debug(value);
        dropdownValue = value;
      },
    });
    dropdown.render();
    const titleNode = dropdown.node.find('.lake-dropdown-title');
    titleNode.emit('mouseenter');
    expect(titleNode.hasClass('lake-dropdown-title-hovered')).to.equal(true);
    titleNode.emit('mouseleave');
    expect(titleNode.hasClass('lake-dropdown-title-hovered')).to.equal(false);
    click(titleNode);
    expect(dropdown.node.find('.lake-dropdown-menu').computedCSS('display')).to.equal('block');
    click(dropdown.node.find('li[value="underline"]'));
    expect(dropdownValue).to.equal('underline');
    expect(dropdown.node.find('.lake-dropdown-menu').computedCSS('display')).to.equal('none');
    dropdown.unmount();
  });

  it('icon button with icon menu: select an item', () => {
    let dropdownValue;
    const dropdown = new Dropdown({
      root: rootNode,
      name: 'emoji',
      icon: icons.get('emoji'),
      downIcon: icons.get('down'),
      tooltip: 'Emoji',
      menuType: 'icon',
      menuItems: emojiMenuItems,
      onSelect: value => {
        debug(value);
        dropdownValue = value;
      },
    });
    dropdown.render();
    const titleNode = dropdown.node.find('.lake-dropdown-title');
    titleNode.emit('mouseenter');
    expect(titleNode.hasClass('lake-dropdown-title-hovered')).to.equal(true);
    titleNode.emit('mouseleave');
    expect(titleNode.hasClass('lake-dropdown-title-hovered')).to.equal(false);
    click(titleNode);
    expect(dropdown.node.find('.lake-dropdown-menu').computedCSS('display')).to.equal('flex');
    click(dropdown.node.find('li[value="face_blowing_a_kiss_color.svg"]'));
    expect(dropdownValue).to.equal('face_blowing_a_kiss_color.svg');
    expect(dropdown.node.find('.lake-dropdown-menu').computedCSS('display')).to.equal('none');
    dropdown.unmount();
  });

  it('icon button with character menu: select an item', () => {
    let dropdownValue;
    const dropdown = new Dropdown({
      root: rootNode,
      name: 'specialCharacter',
      icon: icons.get('specialCharacter'),
      downIcon: icons.get('down'),
      tooltip: 'Special character',
      menuType: 'character',
      menuItems: specialCharacterItems,
      onSelect: value => {
        debug(value);
        dropdownValue = value;
      },
    });
    dropdown.render();
    const titleNode = dropdown.node.find('.lake-dropdown-title');
    titleNode.emit('mouseenter');
    expect(titleNode.hasClass('lake-dropdown-title-hovered')).to.equal(true);
    titleNode.emit('mouseleave');
    expect(titleNode.hasClass('lake-dropdown-title-hovered')).to.equal(false);
    click(titleNode);
    expect(dropdown.node.find('.lake-dropdown-menu').computedCSS('display')).to.equal('flex');
    click(dropdown.node.find('li[value="😃"]'));
    expect(dropdownValue).to.equal('😃');
    expect(dropdown.node.find('.lake-dropdown-menu').computedCSS('display')).to.equal('none');
    dropdown.unmount();
  });

  it('color dropdown: select a color', () => {
    let dropdownValue;
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
        dropdownValue = value;
      },
    });
    dropdown.render();
    const iconNode = dropdown.node.find('.lake-dropdown-icon');
    const downIconNode = dropdown.node.find('.lake-dropdown-down-icon');
    // mouse effect
    iconNode.emit('mouseenter');
    expect(iconNode.hasClass('lake-dropdown-icon-hovered')).to.equal(true);
    iconNode.emit('mouseleave');
    expect(iconNode.hasClass('lake-dropdown-icon-hovered')).to.equal(false);
    downIconNode.emit('mouseenter');
    expect(downIconNode.hasClass('lake-dropdown-down-icon-hovered')).to.equal(true);
    downIconNode.emit('mouseleave');
    expect(downIconNode.hasClass('lake-dropdown-down-icon-hovered')).to.equal(false);
    // click icon
    click(iconNode);
    expect(dropdownValue).to.equal('#e53333');
    // show menu
    click(downIconNode);
    expect(dropdown.node.find('.lake-dropdown-menu').computedCSS('display')).to.equal('flex');
    click(dropdown.node.find('li[value="#666666"]'));
    expect(dropdownValue).to.equal('#666666');
    expect(dropdown.node.find('.lake-dropdown-menu').computedCSS('display')).to.equal('none');
    dropdown.unmount();
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
    const iconNode = dropdown.node.find('.lake-dropdown-icon');
    iconNode.emit('mouseenter');
    expect(iconNode.hasClass('lake-dropdown-icon-hovered')).to.equal(false);
    const downIconNode = dropdown.node.find('.lake-dropdown-down-icon');
    downIconNode.emit('mouseenter');
    expect(downIconNode.hasClass('lake-dropdown-down-icon-hovered')).to.equal(false);
    click(downIconNode);
    expect(dropdown.node.find('.lake-dropdown-menu').computedCSS('display')).to.equal('none');
    dropdown.unmount();
  });

});
