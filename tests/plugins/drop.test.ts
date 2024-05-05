import sinon from 'sinon';
import { Box } from '../../src';
import { testPlugin } from '../utils';

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
        let html = '';
        const dragEvent = {
          ...new Event('drag'),
          target: editor.container.find('lake-box').get(0),
          dataTransfer: {
            getData: () => {},
            setData: (type: string, data: string) => {
              html = data;
            },
            clearData: () => {},
          },
          preventDefault: ()=> {},
        };
        editor.container.emit('dragstart', dragEvent as Event);
        const targetBlcok = editor.container.find('p');
        const targetBlcokRect = (targetBlcok.get(0) as Element).getBoundingClientRect();
        const dropoverEvent = {
          ...new Event('drag'),
          target: targetBlcok.get(0),
          clientY: targetBlcokRect.y,
          dataTransfer: {
            getData: () => html,
            clearData: () => {},
          },
          preventDefault: ()=> {},
        };
        editor.container.emit('dragover', dropoverEvent as Event);
        const dropEvent = {
          ...new Event('drag'),
          dataTransfer: {
            getData: () => html,
            clearData: () => {},
            files: [],
          },
          preventDefault: ()=> {},
        };
        editor.container.emit('drop', dropEvent as Event);
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
        let html = '';
        const dragEvent = {
          ...new Event('drag'),
          target: editor.container.find('lake-box').get(0),
          dataTransfer: {
            getData: () => {},
            setData: (type: string, data: string) => {
              html = data;
            },
            clearData: () => {},
          },
          preventDefault: ()=> {},
        };
        editor.container.emit('dragstart', dragEvent as Event);
        const targetBlcok = editor.container.find('p');
        const targetBlcokRect = (targetBlcok.get(0) as Element).getBoundingClientRect();
        const dropoverEvent = {
          ...new Event('drag'),
          target: targetBlcok.get(0),
          clientY: targetBlcokRect.y + targetBlcokRect.height,
          dataTransfer: {
            getData: () => html,
            clearData: () => {},
          },
          preventDefault: ()=> {},
        };
        editor.container.emit('dragover', dropoverEvent as Event);
        const dropEvent = {
          ...new Event('drag'),
          dataTransfer: {
            getData: () => html,
            clearData: () => {},
            files: [],
          },
          preventDefault: ()=> {},
        };
        editor.container.emit('drop', dropEvent as Event);
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
        const event = {
          ...new Event('drag'),
          target: editor.container.find('p').get(0),
          dataTransfer: {
            getData: () => {},
            clearData: () => {},
            files,
          },
          preventDefault: ()=> {},
        };
        editor.container.emit('drop', event as Event);
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
