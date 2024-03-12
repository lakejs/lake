import { expect } from 'chai';
import { testBox } from '../utils';

const imageUrl = './data/cow.jpg';

describe('boxes / image', () => {

  it('uploading status', () => {
    testBox('image', {
      url: imageUrl,
      status: 'uploading',
    }, box => {
      expect(box.value.status).to.equal('uploading');
    });
  });

  it('done status', () => {
    testBox('image', {
      url: imageUrl,
      status: 'done',
    }, box => {
      expect(box.value.status).to.equal('done');
    });
  });

  it('error status', () => {
    testBox('image', {
      url: imageUrl,
      status: 'error',
    }, box => {
      expect(box.value.status).to.equal('error');
    });
  });

});
