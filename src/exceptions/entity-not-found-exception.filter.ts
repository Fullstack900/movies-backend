import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch(EntityNotFoundError, QueryFailedError, Error)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {

    public catch(exception: EntityNotFoundError | QueryFailedError | Error, host: ArgumentsHost) {
        console.log('here in entity');
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception instanceof EntityNotFoundError) {
            // Handle entity not found error
            return response.status(404).json({ message: 'Entity not found' });
        } else if (exception instanceof QueryFailedError && exception.message.includes('unique constraint')) {
            // Handle unique constraint violation error
            return response.status(400).json({ message: 'Unique constraint violation' });
        } else {
            // Handle other errors (e.g., validation errors, duplicate key violation)
            if (exception instanceof Error) {
                // Handle general errors
                return response.status(400).json({ message: `Bad Request: ${exception.message || 'Unknown error'}` });
            } else {
                // Handle other specific error types if needed
                return response.status(400).json({ message: 'Bad Request: Unknown error' });
            }
        }
    }
}
