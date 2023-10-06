import type { Core } from '../core';

type PluginFunction = (editor: Core) => void;

export class Plugin {
  private pluginList: PluginFunction[];

  constructor() {
    this.pluginList = [];
  }

  public add(plugin: PluginFunction) {
    this.pluginList.push(plugin);
  }

  public loadAll(editor: Core) {
    this.pluginList.forEach(plugin => {
      plugin(editor);
    });
  }
}
