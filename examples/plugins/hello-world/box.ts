import { BoxComponent, Utils } from '../../../src';

const { query, safeTemplate } = Utils;

export default {
  type: 'block',
  name: 'helloWorld',
  value: {
    number: 0,
  },
  render: box => {
    const editor = box.getEditor();
    const value = box.value;
    const boxContainer = box.getContainer();
    const rootNode = query(safeTemplate`
      <div class="lake-hello-world">
        <div>Hello World!</div>
        <div>
          <button type="button" class="lake-button lake-text-button">Count</button>
          <span>${value.number}</span>
        </div>
      </div>
    `);
    boxContainer.empty();
    boxContainer.append(rootNode);
    const numberNode = rootNode.find('span');
    rootNode.find('button').on('click', () => {
      const nextNumber = Number.parseInt(numberNode.text(), 10) + 1;
      numberNode.text(nextNumber.toString(10));
      box.updateValue({
        number: nextNumber,
      });
      editor.history.save();
    });
    rootNode.on('click', () => {
      editor.selection.selectBox(box);
    });
  },
} as BoxComponent;
