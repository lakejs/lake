import pkg from '../package.json';
import { NativeElement } from './types/native';
import { EditArea } from './modules/edit-area';

class LakeCore {
  version: string;
  editArea: EditArea;

  constructor(target: string | NativeElement, options: {[key: string]: string | boolean} = {}) {
    this.version = pkg.version;
    this.editArea = new EditArea(target, options);
  }

  create() {
    this.editArea.create();
  }
}

export default LakeCore;
