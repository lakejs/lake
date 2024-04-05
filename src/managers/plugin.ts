import type { Editor } from '../editor';

type PluginFunction = (editor: Editor) => void;

export class Plugin {
  private pluginList: PluginFunction[] = [];

  public add(plugin: PluginFunction) {
    this.pluginList.push(plugin);
  }

  public loadAll(editor: Editor) {
    this.pluginList.forEach(plugin => {
      plugin(editor);
    });
  }
}
