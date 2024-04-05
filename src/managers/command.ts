import EventEmitter from 'eventemitter3';
import { AppliedItem } from '../types/object';
import { debug } from '../utils/debug';
import { Selection } from './selection';

type CommmandItem = {
  isDisabled?: (AppliedItems: AppliedItem[]) => boolean;
  isSelected?: (appliedItems: AppliedItem[]) => boolean;
  selectedValues?: (AppliedItems: AppliedItem[]) => string[];
  execute: (...data: any[]) => void;
};

export class Command {
  private selection: Selection;

  private commandMap: Map<string, CommmandItem> = new Map();

  public event: EventEmitter = new EventEmitter();

  constructor(selection: Selection) {
    this.selection = selection;
  }

  public add(name: string, handler: CommmandItem) {
    this.commandMap.set(name, handler);
  }

  public getNames(): string[] {
    return Array.from(this.commandMap.keys());
  }

  public getItem(name: string): CommmandItem {
    const commandItem = this.commandMap.get(name);
    if (commandItem === undefined) {
      throw new Error(`Command '${name}' does not exist.`);
    }
    return commandItem;
  }

  public isDisabled(name: string): boolean {
    const commandItem = this.getItem(name);
    if (!commandItem.isDisabled) {
      return false;
    }
    const appliedItems = this.selection.getAppliedItems();
    return commandItem.isDisabled(appliedItems);
  }

  public isSelected(name: string): boolean {
    const commandItem = this.getItem(name);
    if (!commandItem.isSelected) {
      return false;
    }
    const appliedItems = this.selection.getAppliedItems();
    return commandItem.isSelected(appliedItems);
  }

  public selectedValues(name: string): string[] {
    const commandItem = this.getItem(name);
    if (!commandItem.selectedValues) {
      return [];
    }
    const appliedItems = this.selection.getAppliedItems();
    return commandItem.selectedValues(appliedItems);
  }

  public execute(name: string, ...data: any[]): void {
    const commandItem = this.getItem(name);
    this.event.emit('beforeexecute', name);
    commandItem.execute.apply(this, data);
    this.event.emit('execute', name);
    debug(`Command '${name}' executed`);
  }
}
