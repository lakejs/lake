/**
The MIT License (MIT)

Copyright (c) 2016-present react-component

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Repository: https://github.com/react-component/upload
*/

import { UploadRequestError, UploadRequestOption } from '../types/request';

function getError(option: UploadRequestOption, xhr: XMLHttpRequest) {
  const msg = `Cannot ${option.method} ${option.action} ${xhr.status}'`;
  const err = new Error(msg) as UploadRequestError;
  err.status = xhr.status;
  err.method = option.method;
  err.url = option.action;
  return err;
}

function getBody(xhr: XMLHttpRequest) {
  const text = xhr.responseText || xhr.response;
  if (!text) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// Sends a request to the server.
export function request(option: UploadRequestOption): XMLHttpRequest {
  const xhr = new XMLHttpRequest();

  if (option.onProgress && xhr.upload) {
    xhr.upload.onprogress = (e) => {
      if (e.total > 0) {
        e.percent = (e.loaded / e.total) * 100;
      }
      if (option.onProgress) {
        option.onProgress(e);
      }
    };
  }

  const formData = new FormData();

  const data = option.data || {};
  Object.keys(data).forEach(key => {
    const value = data[key];
    // support key-value array data
    if (Array.isArray(value)) {
      value.forEach(item => {
        // { list: [ 11, 22 ] }
        // formData.append('list[]', 11);
        formData.append(`${key}[]`, item);
      });
      return;
    }

    formData.append(key, value as string | Blob);
  });

  if (option.file) {
    const filename = option.filename || 'file';
    if (option.file instanceof Blob) {
      formData.append(filename, option.file, (option.file as any).name);
    } else {
      formData.append(filename, option.file);
    }
  }

  xhr.onerror = (e) => {
    if (option.onError) {
      option.onError(e);
    }
  };

  xhr.onload = () => {
    // allow success when 2xx status
    // see https://github.com/react-component/upload/issues/34
    if (xhr.status < 200 || xhr.status >= 300) {
      if (!option.onError) {
        return;
      }
      return option.onError(getError(option, xhr), getBody(xhr));
    }
    if (!option.onSuccess) {
      return;
    }
    return option.onSuccess(getBody(xhr), xhr);
  };

  xhr.open(option.method, option.action, true);

  // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179
  if (option.withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true;
  }

  const headers = option.headers || {};

  // when set headers['X-Requested-With'] = null , can close default XHR header
  // see https://github.com/react-component/upload/issues/33
  if (headers['X-Requested-With'] !== null) {
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  }

  Object.keys(headers).forEach(h => {
    if (headers[h] !== null) {
      xhr.setRequestHeader(h, headers[h]);
    }
  });

  xhr.send(formData);

  return xhr;
}
