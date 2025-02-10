import type { Editor } from 'lakelib/editor';
import { query } from 'lakelib/utils/query';
import { getBox } from 'lakelib/utils/get-box';
import { template } from 'lakelib/utils/template';
import { Nodes } from 'lakelib/models/nodes';

export default (editor: Editor) => {
  if (editor.readonly) {
    return;
  }
  let draggedNode: Nodes | null = null;
  let dropIndication: Nodes | null = null;
  let targetBlock: Nodes | null = null;
  let dropPosition: 'top' | 'bottom' = 'bottom';
  // The dragstart event is fired when the user starts dragging an element or text selection.
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
      dragEvent.preventDefault();
      return;
    }
    const box = getBox(boxNode);
    if (box.type === 'inline') {
      dragEvent.preventDefault();
      return;
    }
    draggedNode = boxNode;
    // prepare an indication rod
    dropIndication = query(template`
    <div class="lake-drop-indication">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256">
        <path d="M181.66,133.66l-80,80A8,8,0,0,1,88,208V48a8,8,0,0,1,13.66-5.66l80,80A8,8,0,0,1,181.66,133.66Z"></path>
      </svg>
    </div>
    `);
    editor.overlayContainer.append(dropIndication);
  });
  // The dragover event is fired when an element or text selection is being dragged over a valid drop target (every few hundred milliseconds).
  editor.container.on('dragover', event => {
    const dragEvent = event as DragEvent;
    dragEvent.preventDefault();
    const dataTransfer = dragEvent.dataTransfer;
    if (!dataTransfer) {
      return;
    }
    dataTransfer.dropEffect = 'move';
    if (!dropIndication) {
      return;
    }
    const targetNode = query(dragEvent.target as Element);
    if (targetNode.isContainer) {
      return;
    }
    const targetBoxNode = targetNode.closest('lake-box');
    if (targetBoxNode.length > 0) {
      if (targetBoxNode.isBlockBox) {
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
    let top = targetBlcokRect.y + targetBlcokRect.height - containerRect.y + (Number.parseInt(targetBlock.computedCSS('margin-bottom'), 10) / 2);
    if (dragEvent.clientY < targetBlcokRect.y + (targetBlcokRect.height / 2)) {
      const prevBlock = targetBlock.prev();
      if ((prevBlock.length > 0 && prevBlock.isBlock) || prevBlock.isBlockBox) {
        targetBlock = prevBlock;
        targetBlcokRect = (targetBlock.get(0) as Element).getBoundingClientRect();
        left = targetBlcokRect.x - containerRect.x;
        top = targetBlcokRect.y + targetBlcokRect.height - containerRect.y + (Number.parseInt(targetBlock.computedCSS('margin-bottom'), 10) / 2);
      } else {
        dropPosition = 'top';
        top = targetBlcokRect.y - containerRect.y - (Number.parseInt(editor.container.computedCSS('padding-top'), 10) / 2);
      }
    }
    dropIndication.css({
      top: `${top}px`,
      left: `${left}px`,
      width: `${targetBlcokRect.width}px`,
      display: 'block',
    });
  });
  // The dragend event is fired when a drag operation ends (by releasing a mouse button or hitting the escape key).
  editor.container.on('dragend', () => {
    if (!dropIndication) {
      return;
    }
    dropIndication.remove();
    dropIndication = null;
  });
  // The drop event is fired when an element or text selection is dropped on a valid drop target.
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
    // drop a box
    if (draggedNode && targetBlock && draggedNode.isBox) {
      if (draggedNode.get(0) === targetBlock.get(0)) {
        return;
      }
      if (dropPosition === 'bottom' && draggedNode.get(0) === targetBlock.next().get(0)) {
        return;
      }
      dragEvent.preventDefault();
      const draggedBox = getBox(draggedNode);
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
      editor.selection.insertBox(draggedBox.name, draggedBox.value);
      draggedNode.remove();
      editor.history.save();
    }
  });
};
