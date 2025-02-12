import type { Editor } from '../editor';
import { InitializePlugin, UnmountPlugin } from '../types/plugin';

/**
 * The Plugin interface manages a collection of plugins.
 * It allows plugins to be added and loaded into an Editor instance, and it handles the initialization and unmounting of those plugins.
 */
export class Plugin {
  private readonly pluginMap = new Map<string, InitializePlugin>();

  /**
   * Registers a plugin using a name as the key.
   */
  public add(name: string, plugin: InitializePlugin): void {
    this.pluginMap.set(name, plugin);
  }

  /**
   * Loads all registered plugins.
   */
  public loadAll(editor: Editor): Map<string, UnmountPlugin> {
    const unmountPluginMap = new Map<string, UnmountPlugin>();
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
