import type { BoxComponent } from '..';
import { query } from '../utils/query';

export const videoBox: BoxComponent = {
  type: 'block',
  name: 'video',
  render: box => {
    const editor = box.getEditor();
    if (!editor) {
      return;
    }
    const value = box.value;
    const container = box.getContainer();
    const videoNode = query('<div class="lake-video" />');
    videoNode.addClass(`lake-video-${value.status}`);
    videoNode.html('this is video box');
    container.empty();
    container.append(videoNode);
  },
};
