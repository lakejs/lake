export type BeforeUploadFileType = File | Blob | boolean | string;

export type UploadRequestMethod = 'POST' | 'PUT' | 'PATCH' | 'post' | 'put' | 'patch';

export type UploadRequestHeader = Record<string, string>;

export interface UploadRequestError extends Error {
  status?: number;
  method?: UploadRequestMethod;
  url?: string;
}

export interface UploadRequestOption<T = any> {
  method: UploadRequestMethod;
  action: string;
  file: Exclude<BeforeUploadFileType, File | boolean> | File;
  onSuccess?: (body: T, xhr?: XMLHttpRequest) => void;
  onProgress?: (event: ProgressEvent) => void;
  onError?: (event: UploadRequestError | ProgressEvent, body?: T) => void;
  data?: Record<string, unknown>;
  filename?: string;
  withCredentials?: boolean;
  headers?: UploadRequestHeader;
}
