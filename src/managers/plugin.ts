import type { Editor } from '../editor';
import { InitializePlugin, UnmountPlugin } from '../types/plugin';

export class Plugin {
  private pluginMap: Map<string, InitializePlugin> = new Map();

  public add(name: string, plugin: InitializePlugin): void {
    if (this.pluginMap.get(name)) {
      throw new Error(`Plugin "${name}" is already defined.`);
    }
    this.pluginMap.set(name, plugin);
  }

  public loadAll(editor: Editor): Map<string, UnmountPlugin> {
    const unmountPluginMap: Map<string, UnmountPlugin> = new Map();
    for (const name of this.pluginMap.keys()) {
      const plugin = this.pluginMap.get(name);
      if (plugin && editor.config[name] !== false) {
        const result = plugin(editor);
        if (result) {
          unmountPluginMap.set(name, result);
        }
      }
    }
    return unmountPluginMap;
  }
}
