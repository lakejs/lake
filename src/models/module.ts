import LakeCore from '../main';
import { debug } from '../utils/debug';

type ModuleType = {
  name: string,
  initialize: (editor: LakeCore) => void,
};

export class Module {
  private dataList: ModuleType[];

  constructor() {
    this.dataList = [];
  }

  public add(module: ModuleType) {
    this.dataList.push(module);
    debug(`Module '${module.name}' is added.`);
  }

  public runAll(editor: LakeCore) {
    this.dataList.forEach(data => {
      data.initialize(editor);
    });
    debug('All modules are initialized.');
  }
}
