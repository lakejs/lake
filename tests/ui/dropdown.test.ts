import { DropdownMenuItem } from '../../src/types/dropdown';
import { debug, query } from '../../src/utils';
import { Dropdown } from '../../src/ui/dropdown';
import { Nodes, icons } from '../../src';

const  headingMenuItems: DropdownMenuItem[] = [
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


const alignMenuItems: DropdownMenuItem[] = [
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

const moreStyleMenuItems: DropdownMenuItem[] = [
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
const colorMenuItems: DropdownMenuItem[] = [
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

describe('ui: ui / dropdown', () => {

  let rootNode: Nodes;

  before(()=> {
    rootNode = query('<div class="lake-dropdown-root lake-custom-properties" />');
    query(document.body).append(rootNode);
  });

  it('heading dropdown', () => {
    const dropdown = new Dropdown({
      root: rootNode,
      downIcon: icons.get('down'),
      defaultValue: 'p',
      tooltip: 'Heading',
      width: '100px',
      menuType: 'list',
      menuItems: headingMenuItems,
      hasDocumentClick: true,
      onSelect: value => {
        debug(value);
      },
    });
    dropdown.render();
    expect(dropdown.root.find('.lake-dropdown-text').length).to.equal(1);
  });

  it('heading dropdown: disabled', () => {
    const dropdown = new Dropdown({
      root: rootNode,
      downIcon: icons.get('down'),
      defaultValue: 'p',
      tooltip: 'Heading',
      width: '100px',
      menuType: 'list',
      menuItems: headingMenuItems,
      hasDocumentClick: true,
      onSelect: value => {
        debug(value);
      },
    });
    dropdown.render();
    dropdown.node.attr('disabled', 'true');
    expect(dropdown.node.find('.lake-dropdown-text').length).to.equal(1);
  });

  it('align dropdown', () => {
    const dropdown = new Dropdown({
      root: rootNode,
      icon: icons.get('alignLeft'),
      downIcon: icons.get('down'),
      defaultValue: '',
      tooltip: 'Alignment',
      width: 'auto',
      menuType: 'list',
      menuItems: alignMenuItems,
      hasDocumentClick: true,
      onSelect: value => {
        debug(value);
      },
    });
    dropdown.render();
    expect(dropdown.node.find('.lake-dropdown-icon').length).to.equal(1);
  });

  it('align dropdown: disabled', () => {
    const dropdown = new Dropdown({
      root: rootNode,
      icon: icons.get('alignLeft'),
      downIcon: icons.get('down'),
      defaultValue: '',
      tooltip: 'Alignment',
      width: 'auto',
      menuType: 'list',
      menuItems: alignMenuItems,
      hasDocumentClick: true,
      onSelect: value => {
        debug(value);
      },
    });
    dropdown.render();
    dropdown.node.attr('disabled', 'true');
    expect(dropdown.node.find('.lake-dropdown-icon').length).to.equal(1);
  });

  it('moreStyle dropdown', () => {
    const dropdown = new Dropdown({
      root: rootNode,
      icon: icons.get('more'),
      defaultValue: '',
      tooltip: 'More style',
      width: 'auto',
      menuType: 'list',
      menuItems: moreStyleMenuItems,
      hasDocumentClick: true,
      onSelect: value => {
        debug(value);
      },
    });
    dropdown.render();
    expect(dropdown.node.find('.lake-dropdown-icon').length).to.equal(1);
  });

  it('moreStyle dropdown: not having document click', () => {
    const dropdown = new Dropdown({
      root: rootNode,
      icon: icons.get('more'),
      defaultValue: '',
      tooltip: 'More style',
      width: 'auto',
      menuType: 'list',
      menuItems: moreStyleMenuItems,
      onSelect: value => {
        debug(value);
      },
    });
    dropdown.render();
    expect(dropdown.node.find('.lake-dropdown-icon').length).to.equal(1);
  });

  it('color dropdown', () => {
    const dropdown = new Dropdown({
      root: rootNode,
      icon: icons.get('fontColor'),
      accentIcon: icons.get('fontColorAccent'),
      downIcon: icons.get('down'),
      defaultValue: '#e53333',
      tooltip: 'Color',
      width: 'auto',
      menuType: 'color',
      menuItems: colorMenuItems,
      hasDocumentClick: true,
      onSelect: value => {
        debug(value);
      },
    });
    dropdown.render();
    expect(dropdown.node.find('.lake-dropdown-icon').length).to.equal(1);
  });

  it('color dropdown: disabled', () => {
    const dropdown = new Dropdown({
      root: rootNode,
      icon: icons.get('fontColor'),
      accentIcon: icons.get('fontColorAccent'),
      downIcon: icons.get('down'),
      defaultValue: '#e53333',
      tooltip: 'Color',
      width: 'auto',
      menuType: 'color',
      menuItems: colorMenuItems,
      hasDocumentClick: true,
      onSelect: value => {
        debug(value);
      },
    });
    dropdown.render();
    dropdown.node.attr('disabled', 'true');
    expect(dropdown.node.find('.lake-dropdown-icon').length).to.equal(1);
  });

});
