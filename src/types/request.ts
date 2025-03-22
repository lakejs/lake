export type BeforeUploadFileType = File | Blob | boolean | string;

export type UploadRequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH';

export type UploadRequestHeader = Record<string, string | null>;

export interface UploadRequestError extends Error {
  status?: number;
  method?: UploadRequestMethod;
  url?: string;
}

export interface UploadRequestOption<T = any> {
  method: UploadRequestMethod;
  action: string;
  file?: Exclude<BeforeUploadFileType, File | boolean> | File;
  onSuccess?: (body: T, xhr?: XMLHttpRequest) => void;
  onProgress?: (event: ProgressEvent) => void;
  onError?: (event: UploadRequestError | ProgressEvent, body?: T) => void;
  data?: Record<string, unknown>;
  fieldName?: string;
  withCredentials?: boolean;
  headers?: UploadRequestHeader;
}
