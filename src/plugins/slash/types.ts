import type { Editor } from '../../editor';
import { TranslationFunctions } from '../../i18n/types';

export type SlashButtonItem = {
  name: string;
  type: 'button';
  icon?: string;
  title: string | ((locale: TranslationFunctions) => string);
  description: string | ((locale: TranslationFunctions) => string);
  onClick: (editor: Editor, value: string) => void;
};

export type SlashUploadItem = {
  name: string;
  type: 'upload';
  icon?: string;
  title: string | ((locale: TranslationFunctions) => string);
  description: string | ((locale: TranslationFunctions) => string);
  accept?: string;
  multiple?: boolean;
};

export type SlashItem = SlashButtonItem | SlashUploadItem;
