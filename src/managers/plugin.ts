import type { Editor } from '../editor';

type PluginFunction = (editor: Editor) => void;

export class Plugin {
  private pluginList: PluginFunction[] = [];

  public add(plugin: PluginFunction) {
    this.pluginList.push(plugin);
  }

  public loadAll(editor: Editor) {
    for (const plugin of this.pluginList) {
      const pluginName = plugin.name.replace(/^(\w+).*$/, '$1');
      if (editor.config[pluginName] !== false) {
        plugin(editor);
      }
    }
  }
}
