import { HttpException, HttpStatus } from '@nestjs/common';
import { INTERNAL_SERVER_ERROR } from '../messages/internal-server-error.message';
import { Request } from 'express';
import { getLanguageFromRequest } from 'src/modules/language/helper/get-language-code.helper';

export function catchingError(error, request: Request) {
  const language = getLanguageFromRequest(request);
  const message = error?.message || INTERNAL_SERVER_ERROR.getMessage(language);
  const statusCode =
    error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  throw new HttpException(message, statusCode);
}
