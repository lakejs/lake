import type { Editor } from 'lakelib/editor';
import { TranslationFunctions } from 'lakelib/i18n/types';

export interface SlashButtonItem {
  name: string;
  type: 'button';
  icon?: string;
  title: string | ((locale: TranslationFunctions) => string);
  description: string | ((locale: TranslationFunctions) => string);
  onClick: (editor: Editor, value: string) => void;
}

export interface SlashUploadItem {
  name: string;
  type: 'upload';
  icon?: string;
  title: string | ((locale: TranslationFunctions) => string);
  description: string | ((locale: TranslationFunctions) => string);
  accept?: string;
  multiple?: boolean;
}

export type SlashItem = SlashButtonItem | SlashUploadItem;
