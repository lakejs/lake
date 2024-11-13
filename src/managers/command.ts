import { ActiveItem } from '../types/selection';
import { debug } from '../utils/debug';
import { Selection } from './selection';

type CommmandItem = {
  isDisabled?: (activeItems: ActiveItem[]) => boolean;
  isSelected?: (activeItems: ActiveItem[]) => boolean;
  selectedValues?: (activeItems: ActiveItem[]) => string[];
  execute: (...data: any[]) => void;
};

export class Command {
  private selection: Selection;

  private commandMap: Map<string, CommmandItem> = new Map();

  constructor(selection: Selection) {
    this.selection = selection;
  }

  public add(name: string, commandItem: CommmandItem) {
    this.commandMap.set(name, commandItem);
  }

  public delete(name: string) {
    this.commandMap.delete(name);
  }

  public getNames(): string[] {
    return Array.from(this.commandMap.keys());
  }

  public has(name: string): boolean {
    return this.commandMap.get(name) !== undefined;
  }

  public getItem(name: string): CommmandItem {
    const commandItem = this.commandMap.get(name);
    if (commandItem === undefined) {
      throw new Error(`Command "${name}" has not been defined yet.`);
    }
    return commandItem;
  }

  public isDisabled(name: string): boolean {
    const commandItem = this.getItem(name);
    if (!commandItem.isDisabled) {
      return false;
    }
    const activeItems = this.selection.getActiveItems();
    return commandItem.isDisabled(activeItems);
  }

  public isSelected(name: string): boolean {
    const commandItem = this.getItem(name);
    if (!commandItem.isSelected) {
      return false;
    }
    const activeItems = this.selection.getActiveItems();
    return commandItem.isSelected(activeItems);
  }

  public selectedValues(name: string): string[] {
    const commandItem = this.getItem(name);
    if (!commandItem.selectedValues) {
      return [];
    }
    const activeItems = this.selection.getActiveItems();
    return commandItem.selectedValues(activeItems);
  }

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
