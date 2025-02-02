import { CommandItem } from '../types/command';
import { debug } from '../utils/debug';
import { Selection } from './selection';

// The Command interface is used to manage all registered commands.
export class Command {
  private readonly selection: Selection;

  private readonly commandMap: Map<string, CommandItem> = new Map();

  constructor(selection: Selection) {
    this.selection = selection;
  }

  // Registers a new command.
  public add(name: string, commandItem: CommandItem): void {
    this.commandMap.set(name, commandItem);
  }

  // Removes the specified command.
  public delete(name: string): void {
    this.commandMap.delete(name);
  }

  // Returns the names of all registered commands.
  public getNames(): string[] {
    return Array.from(this.commandMap.keys());
  }

  // Returns a boolean value indicating whether the specified command exists.
  public has(name: string): boolean {
    return this.commandMap.get(name) !== undefined;
  }

  // Returns an item by the name of the specified command.
  public getItem(name: string): CommandItem {
    const commandItem = this.commandMap.get(name);
    if (commandItem === undefined) {
      throw new Error(`Command "${name}" has not been defined yet.`);
    }
    return commandItem;
  }

  // Returns a boolean value indicating whether the specified command is disabled.
  public isDisabled(name: string): boolean {
    const commandItem = this.getItem(name);
    if (!commandItem.isDisabled) {
      return false;
    }
    const activeItems = this.selection.getActiveItems();
    return commandItem.isDisabled(activeItems);
  }

  // Returns a boolean value indicating whether the specified command is selected.
  public isSelected(name: string): boolean {
    const commandItem = this.getItem(name);
    if (!commandItem.isSelected) {
      return false;
    }
    const activeItems = this.selection.getActiveItems();
    return commandItem.isSelected(activeItems);
  }

  // Returns the selected values for the specified command.
  public selectedValues(name: string): string[] {
    const commandItem = this.getItem(name);
    if (!commandItem.selectedValues) {
      return [];
    }
    const activeItems = this.selection.getActiveItems();
    return commandItem.selectedValues(activeItems);
  }

  // Executes the specified command.
  public execute(name: string, ...data: any[]): void {
    const container = this.selection.container;
    const range = this.selection.range;
    if (!container.contains(range.commonAncestor)) {
      range.shrinkAfter(container);
    }
    const commandItem = this.getItem(name);
    commandItem.execute.apply(this, data);
    debug(`Command "${name}" executed`);
  }
}
