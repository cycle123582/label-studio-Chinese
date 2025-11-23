export type Endpoints = Record<string, EndpointConfig>;

export type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT" | "HEAD" | "OPTIONS";

export type RequestMode = "same-origin" | "cors";

export type ResponseConverter = (response: any) => Promise<any>;

export type EndpointConfig =
  | string
  | {
      path: string;
      gateway?: string;
      method?: RequestMethod;
      scope?: Record<string, EndpointConfig>;
      params?: Record<string, string>;
      convert?: ResponseConverter;
      forceMock?: boolean;
      mock?: (url: string, params: Record<string, any>, request: Request) => Promise<Record<string, any>>;
      body?: Record<string, any>;
      headers?: Headers;
    };

export type APIProxyOptions<T extends {}> = {
  gateway: string | URL;
  endpoints: T;
  commonHeaders?: Record<string, string>;
  mockDelay?: number;
  mockDisabled?: boolean;
  sharedParams?: Record<string, any>;
  alwaysExpectJSON?: boolean;
  onRequestFinished?: (res: Response) => void;
};

export type ResponseMeta = {
  /**
   * Response headers
   */
  headers: Map<string, string>;
  /**
   * HTTP status
   */
  status: number;
  /**
   * Original requested URL
   */
  url: string;
  /**
   * Indicates if the request returned with 2xx status
   */
  ok: boolean;
};

export type WrappedResponse<T = unknown, ExtraMeta = {}> = T & {
  /**
   * Simplified error message
   */
  error?: string;
  /**
   * Holds an original server response. It might not match with T
   * signature, e.g. error data
   */
  response: Record<string, any>;
  /**
   * Additional data about the request and response
   */
  $meta: ResponseMeta & ExtraMeta;
};

export type ApiResponse = ApiError | Record<string, any>;

export type ApiError = ResponseError | ResponseServerError;

export type ResponseError = {
  status: number;
  error: string;
  response: string | Record<string, any>;
};

export type ResponseServerError = {
  error: string;
  details: string | Record<string, any>;
};
