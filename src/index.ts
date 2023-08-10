import pkg from '../package.json';
import { EditArea } from './modules/edit-area';

class LakeCore {
  version: string;
  editArea: EditArea;

  constructor() {
    this.version = pkg.version;
    this.editArea = new EditArea();
  }

  create() {
    this.editArea.create();
    this.editArea.remove();
  }
}

export default LakeCore;
