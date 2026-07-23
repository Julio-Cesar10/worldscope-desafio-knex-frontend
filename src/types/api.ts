
export interface ApiMeta {
  total: number;
  count: number;
  limit: number;
  offset: number;
  more: boolean;
  request_id?: string;
}

export interface ApiSuccess<T> {
  data: {
    objects: T[];
    meta?: ApiMeta;
  };
}

export interface ApiErrorEntry {
  message: string;
}

export interface ApiError {
  errors: ApiErrorEntry[];
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function isApiError<T>(response: ApiResponse<T>): response is ApiError {
  return (response as ApiError).errors !== undefined;
}


export class RestCountriesError extends Error {
  readonly status?: number;
  readonly friendlyMessage: string;

  constructor(message: string, friendlyMessage: string, status?: number) {
    super(message);
    this.name = 'RestCountriesError';
    this.friendlyMessage = friendlyMessage;
    this.status = status;
  }
}
