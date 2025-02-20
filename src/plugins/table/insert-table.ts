import { debug } from '@/utils/debug';
import { query } from '@/utils/query';
import { Nodes } from '@/models/nodes';
import { Range } from '@/models/range';
import { insertBlock } from '@/operations/insert-block';

// Inserts a table.
export function insertTable(range: Range, rows: number, columns: number): Nodes {
  let html = '<table>';
  for (let i = 0; i < rows; i++) {
    html += '<tr>';
    for (let j = 0; j < columns; j++) {
      html += '<td><p><br /></p></td>';
    }
    html += '</tr>';
  }
  html += '</table>';
  const tableNode = query(html);
  insertBlock(range, tableNode);
  range.shrinkBefore(tableNode);
  debug(`insertTable: table ${tableNode.id}`);
  return tableNode;
}
