import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '../entities/movie/movie';

export class ResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the request was successful' })
    success: boolean;

    @ApiProperty({ example: 'Retrieved Successfully', description: 'Message indicating the result of the request' })
    message: string;

    @ApiProperty({ example: 200, description: 'HTTP status code' })
    statusCode: number;

    @ApiProperty({ example: 1, description: 'Current page number' })
    page?: number;

    @ApiProperty({ example: 10, description: 'Number of items per page' })
    limit?: number;

    @ApiProperty({ example: 100, description: 'Total number of items' })
    total?: number;

    @ApiProperty({ type: [Movie], description: 'List of movies' })
    movies?: Movie[];

    @ApiProperty({ type: Movie, description: 'single of movie' })
    movie?: Movie;
}
