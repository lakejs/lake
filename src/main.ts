import pkg from '../package.json';
import { NativeElement } from './types/native';
import utils from './utils';
import { Command } from './models';
import { EditArea } from './modules/edit-area';

class LakeCore {
  static version: string = pkg.version;
  static utils = utils;
  // static models = models;

  editArea: EditArea;
  command: Command;

  constructor(target: string | NativeElement, options: {[key: string]: string | boolean} = {}) {
    this.editArea = new EditArea(target, options);
    this.command = this.editArea.command;
  }

  create() {
    this.editArea.create();
  }
}

export default LakeCore;
