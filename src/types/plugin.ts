import type { Editor } from '../editor';

export type UnmountPlugin = () => void;

export type InitializePlugin = (editor: Editor) => UnmountPlugin | void;
