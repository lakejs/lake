import { expect } from 'chai';
import { testBox } from '../utils';

// const imageUrl = '../assets/images/heaven-lake-256.png';
const imageUrl = '../assets/images/song-hye-kyo-1024.jpg';

describe('boxes / image', () => {

  it('uploading status', () => {
    testBox('image', {
      url: imageUrl,
      status: 'uploading',
      name: 'lac-gentau-256.jpg',
      size: 10455,
      type: 'image/jpeg',
      lastModified: 1710229517198,
    }, box => {
      expect(box.value.status).to.equal('uploading');
    });
  });

  it('done status', () => {
    testBox('image', {
      url: imageUrl,
      status: 'done',
      name: 'lac-gentau-256.jpg',
      size: 10455,
      type: 'image/jpeg',
      lastModified: 1710229517198,
    }, box => {
      expect(box.value.status).to.equal('done');
    });
  });

  it('error status', () => {
    testBox('image', {
      url: imageUrl,
      status: 'error',
      name: 'lac-gentau-256.jpg',
    }, box => {
      expect(box.value.status).to.equal('error');
    });
  });

});
