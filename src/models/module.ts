import LakeCore from '../main';
import { debug } from '../utils/debug';

type ModuleData = {
  name: string,
  initialize: (editor: LakeCore) => void;
};

export class Module {
  private dataList: ModuleData[] = [];

  constructor() {
    debug('command constructor');
  }

  add(data: ModuleData) {
    this.dataList.push(data);
    debug('add command');
  }

  run(editor: LakeCore) {
    this.dataList.forEach(data => {
      data.initialize(editor);
    });
    debug('run command');
  }
}
