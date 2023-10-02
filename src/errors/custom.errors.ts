import httpStatus from 'http-status-codes';

type HttpExceptionDetails = string | string[];

type HttpExceptionProps = {
  message?: string;
  status?: number;
  details?: HttpExceptionDetails;
};

export class HttpException {
  public readonly status: number;
  public readonly details: string | string[];
  public readonly message: string;

  constructor({ status, details }: HttpExceptionProps) {
    this.status = status ?? 500;
    this.message = httpStatus.getStatusText(this.status);
    this.details = details ?? [];
  }
}

export class NotFoundException extends HttpException {
  constructor(details?: HttpExceptionDetails) {
    super({ status: httpStatus.NOT_FOUND, details });
  }
}

export class UnprocessableEntityException extends HttpException {
  constructor(details?: HttpExceptionDetails) {
    super({ status: httpStatus.UNPROCESSABLE_ENTITY, details });
  }
}

export class ForbiddenException extends HttpException {
  constructor(details?: HttpExceptionDetails) {
    super({ status: httpStatus.FORBIDDEN, details });
  }
}
