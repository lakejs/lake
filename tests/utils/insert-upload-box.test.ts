import sinon from 'sinon';
import { boxes } from '../../src/storage/boxes';
import { base64ToArrayBuffer } from '../utils';
import { query } from '../../src/utils/query';
import { Editor, Nodes } from '../../src';
import { insertUploadBox } from '../../src/utils/insert-upload-box';

const imgBuffer = base64ToArrayBuffer('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/orejrsAAAAASUVORK5CYII=');

describe('utils / insert-upload-box', () => {

  let xhr: sinon.SinonFakeXMLHttpRequestStatic;
  let requests: sinon.SinonFakeXMLHttpRequest[];
  let rootNode: Nodes;
  let editor: Editor;

  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = req => requests.push(req);
    boxes.set('uploadBox', {
      type: 'inline',
      name: 'uploadBox',
      render: () => '<div><span></span></div>',
    });
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
    boxes.delete('uploadBox');
    editor.unmount();
    rootNode.remove();
  });

  it('should upload image', done => {
    const file = new File([imgBuffer], 'foo.png', {
      type: 'image/png',
    });
    const box = insertUploadBox({
      selection: editor.selection,
      boxName: 'uploadBox',
      file,
      requestTypes: ['image/gif', 'image/jpeg', 'image/png'],
      requestMethod: 'POST',
      requestAction: 'upload.do',
      onSuccess: () => {
        expect(box.value.status).to.equal('done');
        done();
      },
    });
    expect(box.value.url.substring(0, 5)).to.equal('blob:');
    requests[0].respond(200, {}, JSON.stringify({
      url: '../assets/images/heaven-lake-512.png',
    }));
    expect(box.value.status).to.equal('uploading');
    expect(editor.container.find('lake-box').length).to.equal(1);
  });

  it('invalid type', () => {
    const file = new File(['foo'], 'foo.txt', {
      type: 'text/plain',
    });
    try {
      insertUploadBox({
        selection: editor.selection,
        boxName: 'uploadBox',
        file,
        requestTypes: ['image/gif', 'image/jpeg', 'image/png'],
        requestMethod: 'POST',
        requestAction: 'upload.do',
      });
    } catch (e) {
      expect(`${e}`.toLowerCase().indexOf('cannot upload') >= 0).to.equal(true);
    }
    expect(editor.container.find('lake-box').length).to.equal(0);
  });

  it('should not create object URL', done => {
    const file = new File(['foo'], 'think-different-wikipedia.pdf', {
      type: 'application/pdf',
    });
    const box = insertUploadBox({
      selection: editor.selection,
      boxName: 'uploadBox',
      file,
      requestTypes: ['application/pdf'],
      requestMethod: 'POST',
      requestAction: 'upload.do',
      onSuccess: () => {
        expect(box.value.status).to.equal('done');
        done();
      },
    });
    expect(box.value.url).to.equal('');
    requests[0].respond(200, {}, JSON.stringify({
      url: '../assets/files/think-different-wikipedia.pdf',
    }));
    expect(box.value.status).to.equal('uploading');
    expect(editor.container.find('lake-box').length).to.equal(1);
  });

  it('with configuring optional properties', done => {
    const file = new File([imgBuffer], 'foo.png', {
      type: 'image/png',
    });
    const box = insertUploadBox({
      selection: editor.selection,
      boxName: 'uploadBox',
      file,
      requestTypes: ['image/gif', 'image/jpeg', 'image/png'],
      requestMethod: 'POST',
      requestAction: 'upload.do',
      requestFieldName: 'foo',
      transformResponse: (body: any) => {
        return {
          url: body.data.url,
        };
      },
      requestWithCredentials: true,
      requestHeaders: { from: 'hello' },
      onSuccess: () => {
        expect(box.value.status).to.equal('done');
        done();
      },
    });
    expect(requests[0].withCredentials).to.equal(true);
    expect(requests[0].requestHeaders.from).to.equal('hello');
    expect((requests[0].requestBody as any).get('foo').name).to.equal('foo.png');
    requests[0].respond(200, {}, JSON.stringify({
      data: {
        url: '../assets/images/heaven-lake-512.png',
      },
    }));
    expect(box.value.status).to.equal('uploading');
    expect(editor.container.find('lake-box').length).to.equal(1);
  });

  it('server returns 500', done => {
    const file = new File([imgBuffer], 'foo.png', {
      type: 'image/png',
    });
    const box = insertUploadBox({
      selection: editor.selection,
      boxName: 'uploadBox',
      file,
      requestTypes: ['image/gif', 'image/jpeg', 'image/png'],
      requestMethod: 'POST',
      requestAction: 'upload.do',
      onError: () => {
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

  it('server returns invalid data', done => {
    const file = new File([imgBuffer], 'foo.png', {
      type: 'image/png',
    });
    const box = insertUploadBox({
      selection: editor.selection,
      boxName: 'uploadBox',
      file,
      requestTypes: ['image/gif', 'image/jpeg', 'image/png'],
      requestMethod: 'POST',
      requestAction: 'upload.do',
      onError: () => {
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
