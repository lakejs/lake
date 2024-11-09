import { BoxComponent } from '../types/box';
import { ToolbarItem } from '../types/toolbar';
import { icons } from '../icons';
import { query } from '../utils/query';
import { template } from '../utils/template';
import { fileSize } from '../utils/file-size';
import { Nodes } from '../models/nodes';
import { Box } from '../models/box';

function setFloatingToolbar(box: Box): void {
  let items: ToolbarItem[] = [
    {
      name: 'download',
      type: 'button',
      icon: icons.get('download'),
      tooltip: locale => locale.file.download(),
      onClick: () => {
        window.open(box.value.url);
      },
    },
    {
      name: 'remove',
      type: 'button',
      icon: icons.get('remove'),
      tooltip: locale => locale.file.remove(),
      onClick: editor => {
        editor.selection.removeBox(box);
        editor.history.save();
      },
    },
  ];
  if (box.value.status !== 'done') {
    items = items.filter(item => item.name === 'remove');
  }
  box.setToolbar(items);
}

async function appendContent(rootNode: Nodes, box: Box): Promise<void> {
  const value = box.value;
  const infoNode = query(template`
    <div class="lake-file-info">
      <div class="lake-file-type"></div>
      <div class="lake-file-name">${value.name} (${fileSize(value.size)})</div>
    </div>
  `);
  const typeNode = infoNode.find('.lake-file-type');
  if (value.status === 'uploading') {
    const percent = Math.round(value.percent || 0);
    const progressNode = query(template`
      <div class="lake-progress">
        <div class="lake-percent">${percent} %</div>
      </div>
    `);
    const circleNotchIcon = icons.get('circleNotch');
    if (circleNotchIcon) {
      progressNode.prepend(circleNotchIcon);
    }
    typeNode.replaceWith(progressNode);
  } else {
    const fileIcon = value.status === 'error' ? icons.get('warningCircle') : icons.get('file');
    if (fileIcon) {
      typeNode.append(fileIcon);
    }
  }
  rootNode.append(infoNode);
}

export default {
  type: 'inline',
  name: 'file',
  render: box => {
    const editor = box.getEditor();
    const value = box.value;
    if (editor.readonly && ['uploading', 'error'].indexOf(value.status) >= 0) {
      box.node.hide();
      return;
    }
    const boxContainer = box.getContainer();
    const rootNode = query('<div class="lake-file" />');
    rootNode.addClass(`lake-file-${value.status}`);
    appendContent(rootNode, box);
    boxContainer.empty();
    boxContainer.append(rootNode);
    if (!editor.readonly) {
      rootNode.on('click', () => {
        editor.selection.selectBox(box);
      });
      setFloatingToolbar(box);
    } else {
      rootNode.on('click', () => {
        window.open(value.url);
      });
    }
  },
} as BoxComponent;
