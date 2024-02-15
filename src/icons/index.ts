// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import undo from './undo.svg';
import redo from './redo.svg';

type IconItem = {
  name: string,
  node: NativeNode,
  title: string,
};

export const icons: IconItem[] = [
  {
    'name': 'undo',
    'node': undo,
    'title': 'Undo',
  },
  {
    'name': 'redo',
    'node': redo,
    'title': 'Redo',
  },
];
