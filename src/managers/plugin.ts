import type { Editor } from '../editor';
import { InitializePlugin, UnmountPlugin } from '../types/plugin';

// The Plugin interface is used to manage a collection of plugins.
export class Plugin {
  private readonly pluginMap: Map<string, InitializePlugin> = new Map();

  // Registers a plugin using a name as the key.
  public add(name: string, plugin: InitializePlugin): void {
    this.pluginMap.set(name, plugin);
  }

  // Loads all registered plugins.
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
