import { testPlugin } from '../utils';

let currentTranferData = '';

function getDragEvent(config: any): Event {
  const dragEvent = {
    ...new Event('drag'),
    target: config.target,
    clientY: config.clientY || 0,
    dataTransfer: {
      getData: () => currentTranferData,
      setData: (type: string, data: string) => {
        currentTranferData = data;
      },
      clearData: () => {},
      files: config.files || [],
    },
    preventDefault: () => {},
  };
  return dragEvent;
}

describe('plugins / drop', () => {

  it('drag and drop: should insert into the top of first paragraph (p + p + box)', () => {
    const content = `
    <p>foo</p>
    <p>bar</p>
    <lake-box type="block" name="hr" focus="end"></lake-box>
    `;
    const output = `
    <lake-box type="block" name="hr" focus="end"></lake-box>
    <p>foo</p>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.container.emit('dragstart', getDragEvent({
          target: editor.container.find('lake-box').get(0),
        }));
        const targetBlcok = editor.container.find('p').eq(0);
        const targetBlcokRect = (targetBlcok.get(0) as Element).getBoundingClientRect();
        editor.container.emit('dragover', getDragEvent({
          target: targetBlcok.get(0),
          clientY: targetBlcokRect.y,
        }));
        editor.container.emit('drop', getDragEvent({
          target: targetBlcok.get(0),
        }));
      },
      true,
    );
  });

  it('drag and drop: should insert into the top of first paragraph (p + box)', () => {
    const content = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="end"></lake-box>
    `;
    const output = `
    <lake-box type="block" name="hr" focus="end"></lake-box>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.container.emit('dragstart', getDragEvent({
          target: editor.container.find('lake-box').get(0),
        }));
        const targetBlcok = editor.container.find('p').eq(0);
        const targetBlcokRect = (targetBlcok.get(0) as Element).getBoundingClientRect();
        editor.container.emit('dragover', getDragEvent({
          target: targetBlcok.get(0),
          clientY: targetBlcokRect.y,
        }));
        editor.container.emit('drop', getDragEvent({
          target: targetBlcok.get(0),
        }));
      },
      true,
    );
  });

  it('drag and drop: should insert into the bottom of first paragraph', () => {
    const content = `
    <p>foo</p>
    <p>bar</p>
    <lake-box type="block" name="hr" focus="end"></lake-box>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="end"></lake-box>
    <p>bar</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.container.emit('dragstart', getDragEvent({
          target: editor.container.find('lake-box').get(0),
        }));
        const targetBlcok = editor.container.find('p').eq(0);
        const targetBlcokRect = (targetBlcok.get(0) as Element).getBoundingClientRect();
        editor.container.emit('dragover', getDragEvent({
          target: targetBlcok.get(0),
          clientY: targetBlcokRect.y + targetBlcokRect.height,
        }));
        editor.container.emit('drop', getDragEvent({
          target: targetBlcok.get(0),
        }));
      },
      true,
    );
  });

  it('drag and drop: should insert into the top of first box', () => {
    const content = `
    <lake-box type="block" name="hr"></lake-box>
    <p>foo</p>
    <lake-box type="block" name="hr" focus="end"></lake-box>
    `;
    const output = `
    <lake-box type="block" name="hr" focus="end"></lake-box>
    <lake-box type="block" name="hr"></lake-box>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.container.emit('dragstart', getDragEvent({
          target: editor.container.find('lake-box').get(1),
        }));
        const targetBlcok = editor.container.find('lake-box').eq(0);
        const targetBlcokRect = (targetBlcok.get(0) as Element).getBoundingClientRect();
        editor.container.emit('dragover', getDragEvent({
          target: targetBlcok.get(0),
          clientY: targetBlcokRect.y,
        }));
        editor.container.emit('drop', getDragEvent({
          target: targetBlcok.get(0),
        }));
      },
      true,
    );
  });

  it('drag and drop: should insert into the bottom of first box', () => {
    const content = `
    <lake-box type="block" name="hr"></lake-box>
    <p>foo</p>
    <lake-box type="block" name="hr" focus="end"></lake-box>
    `;
    const output = `
    <lake-box type="block" name="hr"></lake-box>
    <lake-box type="block" name="hr" focus="end"></lake-box>
    <p>foo</p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.container.emit('dragstart', getDragEvent({
          target: editor.container.find('lake-box').get(1),
        }));
        const targetBlcok = editor.container.find('lake-box').eq(0);
        const targetBlcokRect = (targetBlcok.get(0) as Element).getBoundingClientRect();
        editor.container.emit('dragover', getDragEvent({
          target: targetBlcok.get(0),
          clientY: targetBlcokRect.y + targetBlcokRect.height,
        }));
        editor.container.emit('drop', getDragEvent({
          target: targetBlcok.get(0),
        }));
      },
      true,
    );
  });

});
