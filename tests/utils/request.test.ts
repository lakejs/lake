import sinon from 'sinon';
import { request } from '../../src/utils/request';
import { UploadRequestOption } from '@/types/request';

function empty() {}

const file = new File(['foo'], 'foo.pdf', {
  type: 'application/pdf',
});

const option: UploadRequestOption = {
  onSuccess: empty,
  action: 'upload.do',
  data: { a: 1, b: 2, c: [3, 4] },
  fieldName: 'fooFile',
  file,
  headers: { from: 'hello' },
  method: 'POST',
};

describe('utils / request', () => {

  let xhr: sinon.SinonFakeXMLHttpRequestStatic;
  let requests: any[];

  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = req => requests.push(req);
    option.onError = empty;
    option.onSuccess = empty;
  });

  afterEach(() => {
    xhr.restore();
  });

  it('should return 200 code and trigger onSuccess', done => {
    option.onError = done;
    option.onSuccess = (ret: any) => {
      expect(ret).to.deep.equal({ success: true });
      done();
    };
    request(option);
    expect(requests[0].method).to.deep.equal('POST');
    expect(requests[0].url).to.deep.equal('upload.do');
    expect(requests[0].requestBody.getAll('c[]')).to.deep.equal(['3', '4']);
    expect(requests[0].requestBody.get('fooFile').name).to.equal('foo.pdf');
    requests[0].respond(200, {}, '{"success": true}');
  });

  it('should return 404 code and trigger onError', done => {
    option.onError = (e: any) => {
      expect(e.toString()).contain('404');
      done();
    };

    option.onSuccess = () => done('404 should throw error');
    request(option);
    requests[0].respond(404, {}, 'Not found');
  });

  it('should return 204 code and trigger onSuccess', done => {
    option.onError = done;
    option.onSuccess = (ret: any) => {
      expect(ret).to.equal('');
      done();
    };
    request(option);
    requests[0].respond(204, {});
  });

  it('should set withCredentials', () => {
    option.withCredentials = true;
    request(option);
    expect(requests[0].withCredentials).to.equal(true);
  });

  it('should set headers', () => {
    request(option);
    expect(requests[0].requestHeaders).to.deep.equal({
      'X-Requested-With': 'XMLHttpRequest',
      from: 'hello',
    });
  });

  it('should empty X-Requested-With', () => {
    if (option.headers) {
      option.headers['X-Requested-With'] = null;
    }
    request(option);
    expect(requests[0].requestHeaders).to.deep.equal({ from: 'hello' });
  });

});
