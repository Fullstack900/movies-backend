import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomNotFoundException extends HttpException {
  constructor(message: string) {
    super({
      success: false,
      statusCode:HttpStatus.NOT_FOUND,
      message,
    }, HttpStatus.NOT_FOUND);
  }
}