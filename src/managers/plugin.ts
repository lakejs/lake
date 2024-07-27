import type { Editor } from '../editor';

type PluginFunction = (editor: Editor) => void;

export class Plugin {
  private pluginMap: Map<string, PluginFunction> = new Map();

  public add(name: string, plugin: PluginFunction) {
    if (this.pluginMap.get(name)) {
      throw new Error(`Plugin "${name}" is already defined.`);
    }
    this.pluginMap.set(name, plugin);
  }

  public loadAll(editor: Editor) {
    for (const name of this.pluginMap.keys()) {
      const plugin = this.pluginMap.get(name);
      if (plugin && editor.config[name] !== false) {
        plugin(editor);
      }
    }
  }
}
