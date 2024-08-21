import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { responseData } from './../common/dto/response.dto';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
    constructor(public reflector: Reflector) { }

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const statusCode =
            exception.constraint && exception.constraint.startsWith('UQ')
                ? HttpStatus.CONFLICT
                : exception.status ? exception.status : HttpStatus.BAD_REQUEST;
        // log exception
        const resp = new responseData({});
        resp.success = false;
        debugger
        console.error("ErrorFilter -> catch -> exception", exception)
        resp.message = exception?.response?.message || exception?.message;
        if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR) {
            resp.exception = exception?.stack;
        }
        response.status(statusCode).json(resp);
    }
}