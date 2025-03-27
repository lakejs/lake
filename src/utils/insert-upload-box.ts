import { UploadRequestOption } from '../types/request';
import type { Selection } from '../managers/selection';
import { debug } from './debug';
import { request } from './request';
import { Box } from '../models/box';

interface InsertUploadBoxConfig {
  /**
   * The selection manager where the upload box will be inserted.
   */
  selection: Selection;
  /**
   * Name of the upload box.
   */
  boxName: string;
  /**
   * The file to be uploaded.
   */
  file: File;
  /**
   * Allowed MIME types for the upload.
   */
  requestTypes: string[];
  /**
   * HTTP method for the request.
   */
  requestMethod: UploadRequestOption['method'];
  /**
   * URL where the file will be uploaded.
   */
  requestAction: UploadRequestOption['action'];
  /**
   * The field name for the uploaded file.
   */
  requestFieldName?: UploadRequestOption['fieldName'];
  /**
   * Whether to include credentials in the request.
   */
  requestWithCredentials?: UploadRequestOption['withCredentials'];
  /**
   * Custom headers for the upload request.
   */
  requestHeaders?: UploadRequestOption['headers'];
  /**
   * Function to transform the response before handling it.
   */
  transformResponse?: (body: any) => any;
  /**
   * Callback function triggered when an error occurs.
   */
  onError?: (error: string) => void;
  /**
   * Callback function triggered on successful upload.
   */
  onSuccess?: () => void;
}

/**
 * Inserts an upload box into a given selection and sends an HTTP request to upload the file to a specified URL.
 */
export function insertUploadBox(config: InsertUploadBoxConfig): Box {
  const {
    selection, boxName, file, requestTypes, requestMethod, requestAction, requestFieldName,
    requestWithCredentials, requestHeaders, transformResponse, onError, onSuccess,
  } = config;
  if (requestTypes.indexOf(file.type) < 0) {
    if (onError) {
      onError(`File "${file.name}" is not allowed for uploading.`);
    }
    throw new Error(`Cannot upload file "${file.name}" because its type "${file.type}" is not found in ['${requestTypes.join('\', \'')}'].`);
  }
  const box = selection.insertBox(boxName, {
    url: file.type.indexOf('image/') === 0 ? URL.createObjectURL(file) : '',
    status: 'uploading',
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  });
  let xhr: XMLHttpRequest | null = request({
    onProgress: e => {
      const percentNode = box.node.find('.lake-percent');
      const percent = Math.round(e.percent);
      percentNode.text(`${percent < 100 ? percent : 99} %`);
    },
    onError: (error, body) => {
      xhr = null;
      debug(error.toString(), body);
      box.updateValue('status', 'error');
      box.render();
      if (onError) {
        onError(error.toString());
      }
    },
    onSuccess: body => {
      xhr = null;
      if (transformResponse) {
        body = transformResponse(body);
      }
      if (!body.url) {
        box.updateValue('status', 'error');
        box.render();
        if (onError) {
          onError('Cannot find the url field.');
        }
        return;
      }
      box.updateValue({
        status: 'done',
        url: body.url,
      });
      box.render();
      if (onSuccess) {
        onSuccess();
      }
    },
    file,
    action: requestAction,
    method: requestMethod,
    fieldName: requestFieldName,
    withCredentials: requestWithCredentials,
    headers: requestHeaders,
  });
  box.event.on('beforeunmount', () => {
    if (xhr) {
      xhr.abort();
      debug('Upload canceled');
    }
  });
  return box;
}
