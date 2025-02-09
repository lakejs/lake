import sinon from 'sinon';
import { request } from '../../src/utils/request';

function empty() {}

const option: any = {
  onSuccess: empty,
  action: 'upload.do',
  data: { a: 1, b: 2, c: [3, 4] },
  filename: 'a.png',
  file: 'foo',
  headers: { from: 'hello' },
  method: 'post',
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

  it('upload request success', done => {
    option.onError = done;
    option.onSuccess = (ret: any) => {
      expect(ret).to.deep.equal({ success: true });
      expect(requests[0].requestBody.getAll('c[]')).to.deep.equal(['3', '4']);
      done();
    };
    request(option);
    requests[0].respond(200, {}, '{"success": true}');
  });

  it('40x code should be error', done => {
    option.onError = (e: any) => {
      expect(e.toString()).contain('404');
      done();
    };

    option.onSuccess = () => done('404 should throw error');
    request(option);
    requests[0].respond(404, {}, 'Not found');
  });

  it('2xx code should be success', done => {
    option.onError = done;
    option.onSuccess = (ret: any) => {
      expect(ret).to.equal('');
      done();
    };
    request(option);
    requests[0].respond(204, {});
  });

  it('gets headers', () => {
    request(option);
    expect(requests[0].requestHeaders).to.deep.equal({
      'X-Requested-With': 'XMLHttpRequest',
      from: 'hello',
    });
  });

  it('should empty X-Requested-With', () => {
    option.headers['X-Requested-With'] = null;
    request(option);
    expect(requests[0].requestHeaders).to.deep.equal({ from: 'hello' });
  });

});
