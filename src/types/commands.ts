import type { Editor } from '../editor';
import { TranslationFunctions } from '../i18n/types';

export type CommandButtonItem = {
  name: string;
  type: 'button';
  icon?: string;
  title: string | ((locale: TranslationFunctions) => string);
  description: string | ((locale: TranslationFunctions) => string);
  onClick: (editor: Editor, value: string) => void;
};

export type CommandUploadItem = {
  name: string;
  type: 'upload';
  icon: string;
  title: string | ((locale: TranslationFunctions) => string);
  description: string | ((locale: TranslationFunctions) => string);
  accept?: string;
  multiple?: boolean;
};

export type CommandItem = CommandButtonItem | CommandUploadItem;
