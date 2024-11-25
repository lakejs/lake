import { debug } from 'lakelib/utils/debug';
import { query } from 'lakelib/utils/query';
import { Nodes } from 'lakelib/models/nodes';
import { Range } from 'lakelib/models/range';
import { insertBlock } from 'lakelib/operations/insert-block';

// Inserts a table.
export function insertTable(range: Range, rows: number, columns: number): Nodes {
  let html = '<table>';
  for (let i = 0; i < rows; i++) {
    html += '<tr>';
    for (let j = 0; j < columns; j++) {
      html += '<td><br /></td>';
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
