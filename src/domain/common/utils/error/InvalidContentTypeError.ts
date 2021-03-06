import { ErrorCode } from './ErrorCode';
import InvalidRequestError from './InvalidRequestError';

class InvalidContentTypeError extends InvalidRequestError {
  constructor(message: string) {
    super(message, ErrorCode.INVALID_CONTENT_TYPE);
  }
}

export default InvalidContentTypeError;
