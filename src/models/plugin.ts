import type LakeCore from '../main';

type PluginFunction = (editor: LakeCore) => void;

export class Plugin {
  private pluginList: PluginFunction[];

  constructor() {
    this.pluginList = [];
  }

  public add(plugin: PluginFunction) {
    this.pluginList.push(plugin);
  }

  public loadAll(editor: LakeCore) {
    this.pluginList.forEach(plugin => {
      plugin(editor);
    });
  }
}
