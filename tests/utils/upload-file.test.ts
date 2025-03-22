import sinon from 'sinon';
import { base64ToArrayBuffer } from '../utils';
import { query } from '../../src/utils/query';
import { Editor, Nodes } from '../../src';
import { uploadFile } from '../../src/utils/upload-file';

const imgBuffer = base64ToArrayBuffer('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/orejrsAAAAASUVORK5CYII=');

describe('utils / upload-file', () => {

  let xhr: sinon.SinonFakeXMLHttpRequestStatic;
  let requests: sinon.SinonFakeXMLHttpRequest[];
  let rootNode: Nodes;
  let editor: Editor;

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

  it('should upload image', done => {
    const file = new File([imgBuffer], 'foo.png', {
      type: 'image/png',
    });
    const box = uploadFile({
      editor,
      pluginName: 'image',
      file,
      onSuccess: () => {
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

  it('should upload file', done => {
    const file = new File(['foo'], 'think-different-wikipedia.pdf', {
      type: 'application/pdf',
    });
    const box = uploadFile({
      editor,
      pluginName: 'file',
      file,
      onSuccess: () => {
        expect(box.value.status).to.equal('done');
        done();
      },
    });
    requests[0].respond(200, {}, JSON.stringify({
      url: '../assets/files/think-different-wikipedia.pdf',
    }));
    expect(box.value.status).to.equal('uploading');
    expect(editor.container.find('lake-box').length).to.equal(1);
  });

  it('should upload image after configuring fieldName and transformResponse', done => {
    editor.config.image.fieldName = 'foo';
    editor.config.image.transformResponse = (body: any) => {
      return {
        url: body.data.url,
      };
    };
    const file = new File([imgBuffer], 'foo.png', {
      type: 'image/png',
    });
    const box = uploadFile({
      editor,
      pluginName: 'image',
      file,
      onSuccess: () => {
        expect(box.value.status).to.equal('done');
        done();
      },
    });
    expect((requests[0].requestBody as any).get('foo').name).to.equal('foo.png');
    requests[0].respond(200, {}, JSON.stringify({
      data: {
        url: '../assets/images/heaven-lake-512.png',
      },
    }));
    expect(box.value.status).to.equal('uploading');
    expect(editor.container.find('lake-box').length).to.equal(1);
  });

  it('should not upload image because of invalid type', () => {
    const file = new File(['foo'], 'foo.txt', {
      type: 'text/plain',
    });
    try {
      uploadFile({
        editor,
        pluginName: 'image',
        file,
      });
    } catch (e) {
      expect(`${e}`.toLowerCase().indexOf('cannot upload') >= 0).to.equal(true);
    }
    expect(editor.container.find('lake-box').length).to.equal(0);
  });

  it('should not upload image because server returns 500', done => {
    const file = new File([imgBuffer], 'foo.png', {
      type: 'image/png',
    });
    const box = uploadFile({
      editor,
      pluginName: 'image',
      file,
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

  it('should not upload image because server returns invalid data', done => {
    const file = new File([imgBuffer], 'foo.png', {
      type: 'image/png',
    });
    const box = uploadFile({
      editor,
      pluginName: 'image',
      file,
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
