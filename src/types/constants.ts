//status code
export enum HttpStatus {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  PROCESSING = 102,
  EARLYHINTS = 103,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  AMBIGUOUS = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  REQUESTED_RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  I_AM_A_TEAPOT = 418,
  MISDIRECTED = 421,
  UNPROCESSABLE_ENTITY = 422,
  FAILED_DEPENDENCY = 424,
  PRECONDITION_REQUIRED = 428,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505
}

//progress bar variants
export const PROGRESS_VARIANTS = {
  colors: {
    success: {
      stroke: 'stroke-success',
      track: 'stroke-success opacity-50',
      background: 'bg-[#00A86B1A]'
    },
    warning: {
      stroke: 'stroke-warning',
      track: 'stroke-warning opacity-50',
      background: 'bg-[#FFAD431A]'
    },
    destructive: {
      stroke: 'stroke-destructive',
      track: 'stroke-destructive opacity-50',
      background: 'bg-[#FF47471A]'
    },
    primary: {
      stroke: 'stroke-primary',
      track: 'stroke-primary opacity-50',
      background: 'bg-[#0000801A]'
    }
  },
  sizes: {
    sm: 'size-32 md:size-26 lg:size-30  xl:size-32',
    md: 'size-26 lg:size-34',
    lg: 'size-32 lg:size-30  xl:size-30'
  },
  rotationAngle: {
    default: -90, // Default starting position
    flipped: -180 - 90, // Fully flipped
    quarterTurn: -45, // 45-degree rotation
    halfTurn: -135 // Halfway between default and flipped
  }
};

export const FACULT_ROUTES = ['exams'];
//static test types
export const ALL_INDIA_MOCK_TEST = 1;
export const PREVIOUS_YEAR_TEST = 2;
export const CHAPTER_WISE_TEST = 4;
export const CONCEPT_WISE_TEST = 5;
export const GENERATE_TEST = 3;

// static test type short names
export const ALL_INDIA_MOCK_TEST_SHORT_NAME = 'aimt';
export const PREVIOUS_YEAR_TEST_SHORT_NAME = 'pyt';
export const GENERATE_TEST_SHORT_NAME = 'gt';
export const CHAPTER_WISE_TEST_SHORT_NAME = 'cwt';
export const CONCEPT_WISE_TEST_SHORT_NAME = 'conwt';
