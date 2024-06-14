import { click } from '../utils';
import { debug, query } from '../../src/utils';
import { Dropdown } from '../../src/ui/dropdown';
import { Nodes, icons } from '../../src';

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
    rootNode = query('<div class="lake-dropdown-root lake-custom-properties" />');
    query(document.body).append(rootNode);
  });

  afterEach(() => {
    rootNode.remove();
  });

  it('text dropdown: select an item', () => {
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

  it('text dropdown: close menu by clicking document', () => {
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

  it('text dropdown: should show menu at the top', () => {
    const dropdown = new Dropdown({
      root: rootNode,
      name: 'heading',
      downIcon: icons.get('down'),
      defaultValue: 'p',
      tooltip: 'Heading',
      width: '100px',
      menuType: 'list',
      menuItems: headingMenuItems,
      placement: 'top',
      onSelect: value => {
        debug(value);
      },
    });
    dropdown.render();
    const titleNode = dropdown.node.find('.lake-dropdown-title');
    click(titleNode);
    expect(Number.parseInt(dropdown.node.find('.lake-dropdown-menu').computedCSS('top'), 10) < 0).to.equal(true);
    click(query(document.body));
    expect(dropdown.node.find('.lake-dropdown-menu').computedCSS('display')).to.equal('none');
    dropdown.unmount();
  });

  it('text dropdown: disabled status', () => {
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

  it('icon dropdown: select an item', () => {
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

  it('icon dropdown: disabled status', () => {
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

  it('icon dropdown without down icon: select an item', () => {
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
