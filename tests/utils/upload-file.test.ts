import sinon from 'sinon';
import { query } from '../../src/utils';
import { Editor, Nodes } from '../../src';
import { uploadFile } from '../../src/utils/upload-file';

let xhr: sinon.SinonFakeXMLHttpRequestStatic;
let requests: sinon.SinonFakeXMLHttpRequest[];
let rootNode: Nodes;
let editor: Editor;

describe('utils / upload-file', () => {

  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = req => requests.push(req);
    rootNode = query('<div class="lake-root"></div>');
    query(document.body).append(rootNode);
    editor = new Editor({
      root: rootNode,
      value: '<p><br /><focus /></p>',
    });
    editor.render();
  });

  afterEach(() => {
    xhr.restore();
    editor.unmount();
    rootNode.remove();
  });

  it('uploadImage: upload successful', done => {
    const file = new File(['foo'], 'foo.png', {
      type: 'image/png',
    });
    const box = uploadFile({
      editor,
      name: 'image',
      file,
      onSuccess: ()=> {
        expect(box.value.status).to.equal('done');
        done();
      },
    });
    requests[0].respond(200, {}, JSON.stringify({
      url: '../assets/images/heaven-lake-512.png',
    }));
    expect(box.value.status).to.equal('uploading');
    expect(editor.container.find('lake-box').length).to.equal(1);
  });

  it('uploadImage: invalid type', () => {
    const file = new File(['foo'], 'foo.txt', {
      type: 'text/plain',
    });
    try {
      uploadFile({
        editor,
        name: 'image',
        file,
      });
    } catch (e) {
      expect(`${e}`.toLowerCase().indexOf('cannot upload') >= 0).to.equal(true);
    }
    expect(editor.container.find('lake-box').length).to.equal(0);
  });

  it('uploadImage: server error with status 500', done => {
    const file = new File(['foo'], 'foo.png', {
      type: 'image/png',
    });
    const box = uploadFile({
      editor,
      name: 'image',
      file,
      onError: ()=> {
        expect(box.value.status).to.equal('error');
        done();
      },
    });
    requests[0].respond(500, {}, JSON.stringify({
      error: 'Upload failed.',
    }));
    expect(box.value.status).to.equal('uploading');
    expect(editor.container.find('lake-box').length).to.equal(1);
  });

  it('uploadImage: server error with status 200', done => {
    const file = new File(['foo'], 'foo.png', {
      type: 'image/png',
    });
    const box = uploadFile({
      editor,
      name: 'image',
      file,
      onError: ()=> {
        expect(box.value.status).to.equal('error');
        done();
      },
    });
    requests[0].respond(200, {}, JSON.stringify({
      error: 'Upload failed.',
    }));
    expect(box.value.status).to.equal('uploading');
    expect(editor.container.find('lake-box').length).to.equal(1);
  });

});
