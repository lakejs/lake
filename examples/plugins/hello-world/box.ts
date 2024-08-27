import { BoxComponent, Utils } from '../../../src';

const { query, safeTemplate } = Utils;

export default {
  type: 'inline',
  name: 'helloWorld',
  value: {
    number: 0,
  },
  render: box => {
    const editor = box.getEditor();
    if (!editor) {
      return;
    }
    const value = box.value;
    const boxContainer = box.getContainer();
    const rootNode = query(safeTemplate`
      <div class="lake-hello-world">Count is: <span>${value.number}</span></div>
    `);
    boxContainer.empty();
    boxContainer.append(rootNode);
    const numberNode = rootNode.find('span');
    rootNode.on('click', () => {
      const nextNumber = Number.parseInt(numberNode.text(), 10) + 1;
      numberNode.text(nextNumber.toString(10));
      box.updateValue({
        number: nextNumber,
      });
      editor.history.save();
      editor.selection.selectBox(box);
    });
  },
} as BoxComponent;
