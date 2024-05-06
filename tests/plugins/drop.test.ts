import sinon from 'sinon';
import { Box } from '../../src';
import { testPlugin } from '../utils';

let currentTranferData = '';

function getDragEvent(config:  any): Event {
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
    preventDefault: ()=> {},
  };
  return dragEvent;
}

describe('plugins / drop', () => {

  it('drag and drop: should insert into the top of target block', () => {
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
        const targetBlcok = editor.container.find('p');
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

  it('drag and drop: should insert into the bottom of target block', () => {
    const content = `
    <lake-box type="block" name="hr" focus="end"></lake-box>
    <p>foo</p>
    `;
    const output = `
    <p>foo</p>
    <lake-box type="block" name="hr" focus="end"></lake-box>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.container.emit('dragstart', getDragEvent({
          target: editor.container.find('lake-box').get(0),
        }));
        const targetBlcok = editor.container.find('p');
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

  it('drop an image from the outside', () => {
    const xhr = sinon.useFakeXMLHttpRequest();
    const requests: sinon.SinonFakeXMLHttpRequest[] = [];
    xhr.onCreate = req => requests.push(req);
    const files = [
      new File(['foo'], 'heaven-lake-512.png', {
        type: 'image/png',
      }),
    ];
    const content = `
    <p><br /><focus /></p>
    `;
    const output = `
    <p><lake-box type="inline" name="image" focus="end"></lake-box></p>
    `;
    testPlugin(
      content,
      output,
      editor => {
        editor.container.emit('drop', getDragEvent({
          target: editor.container.find('p').get(0),
          files,
        }));
        requests[0].respond(200, {}, JSON.stringify({
          url: '../assets/images/heaven-lake-512.png',
        }));
        const box = new Box(editor.container.find('lake-box'));
        expect(box.value.status).to.equal('done');
        expect(box.value.url).to.equal('../assets/images/heaven-lake-512.png');
        xhr.restore();
      },
      true,
    );
  });

});
