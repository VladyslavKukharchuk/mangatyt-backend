import { HttpStatus } from '@nestjs/common';

import { CustomException } from './custom.exception';
import { ErrorCodes } from '../enum/error-codes.enum';

export class ValidationException extends CustomException {
  constructor(messages: string | string[]) {
    super(messages, HttpStatus.BAD_REQUEST, ErrorCodes.VALIDATION);
  }
}
