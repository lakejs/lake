import { debug } from 'lakelib/utils/debug';
import { query } from 'lakelib/utils/query';
import { Range } from 'lakelib/models/range';

// Removes a table.
export function deleteTable(range: Range): void {
  const tableNode = range.startNode.closest('table');
  const block = query('<p><br /></p>');
  tableNode.replaceWith(block);
  range.shrinkBefore(block);
  debug(`deleteTable: table ${tableNode.id}`);
}
