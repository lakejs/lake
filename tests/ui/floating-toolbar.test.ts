import { click } from '../utils';
import { icons } from '../../src/icons';
import { debug } from '../../src/utils/debug';
import { query } from '../../src/utils/query';
import { Nodes } from '../../src/models/nodes';
import { Range } from '../../src/models/range';
import { FloatingToolbar } from '../../src/ui/floating-toolbar';
import { Editor } from '../../src';

describe('ui / floating-toolbar', () => {

  let rootNode: Nodes;
  let editor: Editor;

  beforeEach(() => {
    rootNode = query('<div class="lake-root"></div>');
    query(document.body).append(rootNode);
    editor = new Editor({
      root: rootNode,
      value: '<p><focus /><br /></p>',
    });
    editor.render();
  });

  afterEach(() => {
    editor.unmount();
    rootNode.remove();
  });

  it('should click buttons', () => {
    editor.setValue('<p>foo</p>');
    let calledCount = 0;
    const range = new Range();
    range.selectNodeContents(editor.container.find('p'));
    const floatingToolbar = new FloatingToolbar({
      target: range,
      items: [
        {
          name: 'open',
          type: 'button',
          icon: icons.get('open'),
          tooltip: 'Open',
          onClick: () => calledCount++,
        },
        '|',
        {
          name: 'remove',
          type: 'button',
          icon: icons.get('remove'),
          tooltip: 'Remove',
          onClick: () => calledCount++,
        },
      ],
    });
    floatingToolbar.render();
    expect(query(document.body).find('.lake-floating-toolbar').computedCSS('display')).to.equal('flex');
    click(query(document.body).find('.lake-floating-toolbar button[name="open"]'));
    expect(calledCount).to.equal(1);
    click(query(document.body).find('.lake-floating-toolbar button[name="remove"]'));
    expect(calledCount).to.equal(2);
    floatingToolbar.unmount();
    expect(query(document.body).find('.lake-floating-toolbar').length).to.equal(0);
  });

  it('should select a dropdown', () => {
    editor.setValue('<p>foo</p>');
    let dropdownValue = '';
    const range = new Range();
    range.selectNodeContents(editor.container.find('p'));
    const floatingToolbar = new FloatingToolbar({
      target: range,
      items: [
        {
          name: 'align',
          type: 'dropdown',
          downIcon: icons.get('down'),
          icon: icons.get('alignLeft'),
          tooltip: 'Align',
          menuType: 'list',
          menuItems: [
            { value: 'left', text: 'Align left' },
            { value: 'center', text: 'Align center' },
            { value: 'right', text: 'Align right' },
          ],
          onSelect: (rng, value) => {
            debug(value);
            dropdownValue = value;
          },
        },
      ],
    });
    floatingToolbar.render();
    expect(query(document.body).find('.lake-floating-toolbar').computedCSS('display')).to.equal('flex');
    const dropdownNode = query(document.body).find('.lake-floating-toolbar button[name="align"]').closest('.lake-dropdown');
    const titleNode = dropdownNode.find('.lake-dropdown-title');
    titleNode.emit('mouseenter');
    expect(titleNode.hasClass('lake-dropdown-title-hovered')).to.equal(true);
    titleNode.emit('mouseleave');
    expect(titleNode.hasClass('lake-dropdown-title-hovered')).to.equal(false);
    click(titleNode);
    expect(dropdownNode.find('.lake-dropdown-menu').computedCSS('display')).to.equal('block');
    click(dropdownNode.find('li[value="right"]'));
    expect(dropdownValue).to.equal('right');
    expect(dropdownNode.find('.lake-dropdown-menu').computedCSS('display')).to.equal('none');
    floatingToolbar.unmount();
    expect(query(document.body).find('.lake-floating-toolbar').length).to.equal(0);
  });

});
