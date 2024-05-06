import type { Editor } from '..';
import { query, safeTemplate } from '../utils';
import { Nodes } from '../models/nodes';
import { Box } from '../models/box';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  let draggedNode: Nodes | null = null;
  let dropIndication: Nodes | null = null;
  let targetBlock: Nodes | null = null;
  let dropPosition: 'top' | 'bottom' = 'bottom';
  editor.container.on('dragstart', event => {
    draggedNode = null;
    const dragEvent = event as DragEvent;
    const dataTransfer = dragEvent.dataTransfer;
    if (!dataTransfer) {
      return;
    }
    dataTransfer.effectAllowed = 'move';
    // set the dragged node
    const targetNode = query(dragEvent.target as Element);
    const boxNode = targetNode.closest('lake-box');
    if (boxNode.length === 0) {
      return;
    }
    const box = new Box(boxNode);
    if (box.type === 'inline') {
      return;
    }
    dataTransfer.setData('text/html', boxNode.clone(false).outerHTML());
    draggedNode = boxNode;
    // prepare an indication rod
    dropIndication = query(safeTemplate`
    <div class="lake-drop-indication">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M181.66,133.66l-80,80A8,8,0,0,1,88,208V48a8,8,0,0,1,13.66-5.66l80,80A8,8,0,0,1,181.66,133.66Z"></path></svg>
    </div>
    `);
    editor.overlayContainer.append(dropIndication);
    dropIndication.on('dragover', e => {
      const transfer = (e as DragEvent).dataTransfer;
      if (transfer) {
        transfer.dropEffect = 'move';
      }
    });
    dropIndication.on('drop', () => {});
  });
  editor.container.on('dragover', event => {
    const dragEvent = event as DragEvent;
    const dataTransfer = dragEvent.dataTransfer;
    if (!dataTransfer) {
      return;
    }
    dragEvent.preventDefault();
    if (!dropIndication) {
      return;
    }
    const targetNode = query(dragEvent.target as Element);
    if (!targetNode.isInside) {
      return;
    }
    dataTransfer.dropEffect = 'move';
    const targetBoxNode = targetNode.closest('lake-box');
    if (targetBoxNode.length > 0) {
      if (targetBoxNode.attr('type') === 'block') {
        targetBlock = targetBoxNode;
      } else {
        targetBlock = targetBoxNode.closestBlock();
      }
    } else {
      targetBlock = targetNode.closestBlock();
    }
    const containerRect = (editor.container.get(0) as Element).getBoundingClientRect();
    let targetBlcokRect = (targetBlock.get(0) as Element).getBoundingClientRect();
    dropPosition = 'bottom';
    let left = targetBlcokRect.x - containerRect.x;
    let top = targetBlcokRect.y + targetBlcokRect.height - containerRect.y + (parseInt(targetBlock.computedCSS('margin-bottom'), 10) / 2);
    if (dragEvent.clientY < targetBlcokRect.y + (targetBlcokRect.height / 2)) {
      const prevBlock = targetBlock.prev();
      if (prevBlock.length > 0 && prevBlock.isBlock || (prevBlock.isBox && prevBlock.attr('type') === 'block')) {
        targetBlock = prevBlock;
        targetBlcokRect = (targetBlock.get(0) as Element).getBoundingClientRect();
        left = targetBlcokRect.x - containerRect.x;
        top = targetBlcokRect.y + targetBlcokRect.height - containerRect.y + (parseInt(targetBlock.computedCSS('margin-bottom'), 10) / 2);
      } else {
        dropPosition = 'top';
        top = targetBlcokRect.y - containerRect.y - (parseInt(editor.container.computedCSS('padding-top'), 10) / 2);
      }
    }
    dropIndication.css({
      top: `${top}px`,
      left: `${left}px`,
      width: `${targetBlcokRect.width}px`,
      display: 'block',
    });
  });
  editor.container.on('dragend', () => {
    if (!dropIndication) {
      return;
    }
    dropIndication.remove();
    dropIndication = null;
  });
  editor.container.on('drop', event => {
    const dragEvent = event as DragEvent;
    const dataTransfer = dragEvent.dataTransfer;
    if (!dataTransfer) {
      return;
    }
    if (!dropIndication) {
      return;
    }
    dropIndication.remove();
    dropIndication = null;
    const html = dataTransfer.getData('text/html');
    dataTransfer.clearData('text/html');
    // drop a box
    if (draggedNode && targetBlock && draggedNode.get(0) !== targetBlock.get(0)) {
      dragEvent.preventDefault();
      new Box(draggedNode).unmount();
      draggedNode.remove();
      const range = editor.selection.range;
      if (targetBlock.isBox) {
        if (dropPosition === 'top') {
          range.selectBoxStart(targetBlock);
        } else {
          range.selectBoxEnd(targetBlock);
        }
      } else {
        range.selectNodeContents(targetBlock);
        if (dropPosition === 'top') {
          range.collapseToStart();
        } else {
          range.collapseToEnd();
        }
      }
      const box = new Box(query(html));
      editor.insertBox(box.name, box.value);
      editor.history.save();
    }
  });
};
