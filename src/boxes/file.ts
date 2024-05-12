import { BoxComponent } from '../types/box';
import { icons } from '../icons';
import { query } from '../utils/query';
import { safeTemplate } from '../utils/safe-template';
import { Nodes } from '../models/nodes';
import { Box } from '../models/box';

function humanFileSize(size: number): string {
  let i = -1;
  const units = [' KB', ' MB', ' GB'];
  do {
    size /= 1024;
    i++;
    if (i === 2) {
      break;
    }
  } while (size > 1024);
  return Math.max(size, 0.1).toFixed(1) + units[i];
}

// Removes current box.
function removeImageBox(box: Box): void {
  const editor = box.getEditor();
  if (!editor) {
    return;
  }
  const xhr = box.getData('xhr');
  if (xhr) {
    xhr.abort();
  }
  editor.selection.range.selectBox(box.node);
  editor.removeBox();
  editor.history.save();
}

// Displays error icon and filename.
async function renderError(fileNode: Nodes, box: Box): Promise<void> {
  const editor = box.getEditor();
  if (!editor) {
    return;
  }
  const value = box.value;
  const buttonGroupNode = query(safeTemplate`
    <div class="lake-button-group">
      <button type="button" tabindex="-1" class="lake-button-remove" title="${editor.locale.image.remove()}"></button>
    </div>
  `);
  const removeButton = buttonGroupNode.find('.lake-button-remove');
  const removeIcon = icons.get('remove');
  if (removeIcon) {
    removeButton.append(removeIcon);
  }
  const infoNode = query(safeTemplate`
    <div class="lake-file-info">
      <div class="lake-file-type"></div>
      <div class="lake-file-name">${value.name} (${humanFileSize(value.size)})</div>
    </div>
  `);
  const typeNode = infoNode.find('.lake-file-type');
  const fileIcon = icons.get('warningCircle');
  if (fileIcon) {
    typeNode.append(fileIcon);
  }
  fileNode.append(buttonGroupNode);
  fileNode.append(infoNode);
}

// Displays a file with uplaoding progress.
async function renderUploading(fileNode: Nodes, box: Box): Promise<void> {
  const editor = box.getEditor();
  if (!editor) {
    return;
  }
  const value = box.value;
  const buttonGroupNode = query(safeTemplate`
    <div class="lake-button-group">
      <button type="button" tabindex="-1" class="lake-button-remove" title="${editor.locale.image.remove()}"></button>
    </div>
  `);
  const removeButton = buttonGroupNode.find('.lake-button-remove');
  const removeIcon = icons.get('remove');
  if (removeIcon) {
    removeButton.append(removeIcon);
  }
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
  fileNode.append(buttonGroupNode);
  fileNode.append(progressNode);
  fileNode.append(safeTemplate`
    <div class="lake-file-info"><span class="lake-file-name">${value.name}</span></div>
  `);
}

// Displays a file that can be previewed or removed.
async function renderDone(fileNode: Nodes, box: Box): Promise<void> {
  const editor = box.getEditor();
  if (!editor) {
    return;
  }
  const value = box.value;
  const buttonGroupNode = query(safeTemplate`
    <div class="lake-button-group">
      <button type="button" tabindex="-1" class="lake-button-view" title="${editor.locale.image.view()}"></button>
      <button type="button" tabindex="-1" class="lake-button-remove" title="${editor.locale.image.remove()}"></button>
    </div>
  `);
  const viewButton = buttonGroupNode.find('.lake-button-view');
  const maximizeIcon = icons.get('maximize');
  if (maximizeIcon) {
    viewButton.append(maximizeIcon);
  }
  const removeButton = buttonGroupNode.find('.lake-button-remove');
  const removeIcon = icons.get('remove');
  if (removeIcon) {
    removeButton.append(removeIcon);
  }
  const infoNode = query(safeTemplate`
    <div class="lake-file-info">
      <div class="lake-file-type"></div>
      <div class="lake-file-name">${value.name} (${humanFileSize(value.size)})</div>
    </div>
  `);
  const typeNode = infoNode.find('.lake-file-type');
  const fileIcon = icons.get('file');
  if (fileIcon) {
    typeNode.append(fileIcon);
  }
  fileNode.append(buttonGroupNode);
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
    if (value.status === 'uploading') {
      renderUploading(fileNode, box);
    } else if (value.status === 'error') {
      renderError(fileNode, box);
    } else {
      renderDone(fileNode, box);
    }
    container.empty();
    container.append(fileNode);
    // fileNode.find('.lake-button-view').on('click', () => openFullScreen(box));
    if (editor.readonly) {
      fileNode.find('.lake-button-remove').hide();
    } else {
      fileNode.find('.lake-button-remove').on('click', event => {
        event.stopPropagation();
        removeImageBox(box);
      });
    }
    box.event.emit('render');
    fileNode.on('click', () => {
      editor.selection.range.selectBox(box.node);
    });
  },
};
