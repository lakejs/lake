import LakeCore from '../main';

type PluginFunction = (editor: LakeCore) => void;

export class Plugin {
  private data: PluginFunction[];

  constructor() {
    this.data = [];
  }

  public add(plugin: PluginFunction) {
    this.data.push(plugin);
  }

  public runAll(editor: LakeCore) {
    this.data.forEach(plugin => {
      plugin(editor);
    });
  }
}
