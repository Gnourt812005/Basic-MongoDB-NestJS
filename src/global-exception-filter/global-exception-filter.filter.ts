import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilterFilter<T> implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    let status: number;
    let errorMessage: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      errorMessage = exception.getResponse();
    } else {
      status = 500;
      errorMessage = exception.message;
    }

    const errorResponse = {
      status: status,
      error: {
        message: errorMessage.message || exception.message,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    };
    response.status(status).json(errorResponse);
  }
}
