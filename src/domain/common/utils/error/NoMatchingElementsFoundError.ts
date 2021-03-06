import { ErrorCode } from './ErrorCode';
import InvalidRequestError from './InvalidRequestError';

class NoMatchingElementsFoundError extends InvalidRequestError {
  constructor(message: string) {
    super(message, ErrorCode.NO_MATCHING_ELEMENTS_FOUND);
  }
}

export default NoMatchingElementsFoundError;
