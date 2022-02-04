export type ErrorCode =
  | 'CONNECTION_ERROR'
  | 'NETWORK_ERROR'
  | 'FETCH_ERROR'
  | 'REQUEST_COUNT_OVERLOAD'
  | 'REQUEST_RATE_OVERLOAD'
  | 'GRAPHQL_ERROR'
  | 'WS_CONNECTION_ERROR'
  | 'WS_RECONNECTING_ERROR'
  | 'GSHEETS_REQUEST_OVERLOAD';

export type ApiError = {
  message: string;
  code: ErrorCode;
  stack?: string;
};
