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
    tooltip: locale => locale.file.download(),
    onClick: box => {
      window.open(box.value.url);
    },
  },
  {
    name: 'remove',
    type: 'button',
    icon: icons.get('remove'),
    tooltip: locale => locale.file.remove(),
    onClick: box => {
      const editor = box.getEditor();
      if (!editor) {
        return;
      }
      editor.removeBox(box);
      editor.history.save();
      editor.selection.sync();
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
      const scrollListener = () => {
        if (toolbar) {
          toolbar.updatePosition();
        }
      };
      box.event.on('focus', () => {
        const items = value.status === 'done' ? boxToolbarItems : boxToolbarItems.filter(item => item.name === 'remove');
        toolbar = new BoxToolbar({
          root: editor.popupContainer,
          editor,
          box,
          items,
        });
        toolbar.render();
        editor.root.on('scroll', scrollListener);
      });
      box.event.on('blur', () => {
        if (toolbar) {
          toolbar.unmount();
          toolbar = null;
        }
        editor.root.off('scroll', scrollListener);
      });
    } else {
      fileNode.on('click', () => {
        window.open(value.url);
      });
    }
    box.event.emit('render');
  },
};
