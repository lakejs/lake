import './media-box.css';
import { BoxComponent } from '@/types/box';
import { CornerToolbarItem } from '@/types/corner-toolbar';
import { icons } from '@/icons';
import { query } from '@/utils/query';
import { template } from '@/utils/template';
import { Nodes } from '@/models/nodes';
import { Box } from '@/models/box';
import { CornerToolbar } from '@/ui/corner-toolbar';
import { Resizer } from '@/ui/resizer';

function setCornerToolbar(rootNode: Nodes, box: Box): void {
  const editor = box.getEditor();
  const cornerToolbarItems: CornerToolbarItem[] = [];
  if (box.value.status === 'done') {
    cornerToolbarItems.push({
      name: 'download',
      icon: icons.get('download'),
      tooltip: locale => locale.media.download(),
      onClick: () => {
        editor.config.downloadFile('media', box.value.url);
      },
    });
  }
  if (!editor.readonly) {
    cornerToolbarItems.push({
      name: 'remove',
      icon: icons.get('remove'),
      tooltip: editor.locale.media.remove(),
      onClick: event => {
        event.stopPropagation();
        editor.selection.removeBox(box);
        editor.history.save();
      },
    });
  }
  new CornerToolbar({
    locale: editor.locale,
    root: rootNode,
    items: cornerToolbarItems,
  }).render();
}

function renderContent(rootNode: Nodes, box: Box): void {
  const editor = box.getEditor();
  const value = box.value;
  const width = value.width;
  const height = value.height;
  let videoNode = null;
  if (['uploading', 'error'].indexOf(value.status) >= 0) {
    const placeholderNode = query('<div class="lake-media-placeholder" />');
    if (width && height) {
      placeholderNode.css({
        width,
        height,
      });
    }
    placeholderNode.append(icons.get('media')!);
    if (value.status === 'uploading') {
      const percent = Math.round(value.percent || 0);
      const progressNode = query(template`
        <div class="lake-progress">
          <div class="lake-percent">${percent} %</div>
        </div>
      `);
      progressNode.prepend(icons.get('circleNotch')!);
      rootNode.append(progressNode);
    }
    rootNode.append(placeholderNode);
  } else {
    videoNode = query(`<video controls></video>`);
    videoNode.attr('src', value.url);
    if (width && height) {
      videoNode.css({
        width,
        height,
      });
    }
    rootNode.append(videoNode);
  }
  setCornerToolbar(rootNode, box);
  const boxContainer = box.getContainer();
  boxContainer.empty();
  boxContainer.append(rootNode);
  if (!editor.readonly && videoNode) {
    new Resizer({
      root: rootNode,
      target: videoNode,
      onStop: (newWidth, newHeight) => {
        box.updateValue({
          width: `${newWidth}px`,
          height: `${newHeight}px`,
        });
        editor.selection.selectBox(box);
        editor.history.save();
      },
    }).render();
  }
}

export default {
  type: 'inline',
  name: 'media',
  render: box => {
    const editor = box.getEditor();
    const value = box.value;
    if (editor.readonly && ['uploading', 'error'].indexOf(value.status) >= 0) {
      box.node.hide();
      return;
    }
    const rootNode = query('<div class="lake-media" />');
    rootNode.addClass(`lake-media-${value.status}`);
    renderContent(rootNode, box);
  },
} as BoxComponent;
