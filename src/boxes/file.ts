import { BoxComponent } from '../types/box';
import { BoxToolbarItem } from '../types/box-toolbar';
import { icons } from '../icons';
import { query } from '../utils/query';
import { safeTemplate } from '../utils/safe-template';
import { fileSize } from '../utils/file-size';
import { Nodes } from '../models/nodes';
import { Box } from '../models/box';
import { BoxToolbar } from '../ui/box-toolbar';

const boxToolbarItems: BoxToolbarItem[] = [
  {
    name: 'download',
    type: 'button',
    icon: icons.get('download'),
    tooltip: locale => locale.toolbar.undo(),
    onClick: box => {
      const editor = box.getEditor();
      if (!editor) {
        return;
      }
      editor.removeBox(box);
      editor.history.save();
    },
  },
  {
    name: 'remove',
    type: 'button',
    icon: icons.get('remove'),
    tooltip: locale => locale.toolbar.undo(),
    onClick: box => {
      const editor = box.getEditor();
      if (!editor) {
        return;
      }
      editor.removeBox(box);
      editor.history.save();
    },
  },
];

async function appendContent(fileNode: Nodes, box: Box): Promise<void> {
  const editor = box.getEditor();
  if (!editor) {
    return;
  }
  const value = box.value;
  const infoNode = query(safeTemplate`
    <div class="lake-file-info">
      <div class="lake-file-type"></div>
      <div class="lake-file-name">${value.name} (${fileSize(value.size)})</div>
    </div>
  `);
  const typeNode = infoNode.find('.lake-file-type');
  if (value.status === 'uploading') {
    const percent = Math.round(value.percent || 0);
    const progressNode = query(safeTemplate`
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
  fileNode.append(infoNode);
}

export const fileBox: BoxComponent = {
  type: 'inline',
  name: 'file',
  render: box => {
    const editor = box.getEditor();
    if (!editor) {
      return;
    }
    const value = box.value;
    const container = box.getContainer();
    const fileNode = query('<div class="lake-file" />');
    fileNode.addClass(`lake-file-${value.status}`);
    appendContent(fileNode, box);
    container.empty();
    container.append(fileNode);
    if (!editor.readonly) {
      fileNode.on('click', () => {
        editor.selectBox(box);
      });
      let toolbar: BoxToolbar | null = null;
      box.event.on('focus', () => {
        toolbar = new BoxToolbar({
          root: editor.popupContainer,
          editor,
          box,
          items: boxToolbarItems,
        });
        toolbar.render();
      });
      box.event.on('blur', () => {
        if (toolbar) {
          toolbar.unmount();
          toolbar = null;
        }
      });
    }
    box.event.emit('render');
  },
};
