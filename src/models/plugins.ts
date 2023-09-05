import LakeCore from '../main';

type PluginFunction = (editor: LakeCore) => void;

export class Plugins {
  private pluginList: PluginFunction[];

  constructor() {
    this.pluginList = [];
  }

  public add(plugin: PluginFunction) {
    this.pluginList.push(plugin);
  }

  public executeAll(editor: LakeCore) {
    this.pluginList.forEach(plugin => {
      plugin(editor);
    });
  }
}
