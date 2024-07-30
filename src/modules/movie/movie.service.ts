// movie/movie.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie/movie';
import { CreateMovieDto } from './dto/create-movie-dto';
import { UpdateMovieDto } from './dto/update-movie-dto';
import { ResponseDto } from './dto/response-dto';

@Injectable()
export class MovieService {
    constructor(
        @InjectRepository(Movie)
        private movieRepository: Repository<Movie>,
    ) { }

    async create(createMovieDto: CreateMovieDto): Promise<ResponseDto> {
        console.log("🚀 ~ MovieService ~ create ~ createMovieDto:", createMovieDto)
        const movie = this.movieRepository.create(createMovieDto);
        const savedMovie = await this.movieRepository.save(movie);
        return {
            success: true,
            message: 'Movie created successfully',
            statusCode: 201,
            // page: 0,
            // limit: 0,
            // total: 1,
            movies: [savedMovie],
        };
    }

    async findAll(page = 1, limit = 10): Promise<ResponseDto> {
        const [movies, total] = await this.movieRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            success: true,
            message: 'Movies retrieved successfully',
            statusCode: 200,
            page,
            limit,
            total,
            movies,
        };
    }

    async findOne(id: number): Promise<ResponseDto> {
        const movie = await this.movieRepository.findOne({ where: { id } });
        if (!movie) {
            return {
                success: false,
                message: 'Movie not found',
                statusCode: 404,
                // page: 0,
                // limit: 0,
                // total: 0,
                movie: null,
            };
        }
        return {
            success: true,
            message: 'Movie retrieved successfully',
            statusCode: 200,
            // page: 0,
            // limit: 0,
            // total: 1,
            movie: movie,
        };
    }

    async update(id: number, updateMovieDto: UpdateMovieDto): Promise<ResponseDto> {
        const result = await this.movieRepository.update(id, updateMovieDto);
        if (result.affected === 0) {
            return {
                success: false,
                message: 'Movie not found',
                statusCode: 404,
                // page: 0,
                // limit: 0,
                // total: 0,
                movie: null,
            };
        }
        const updatedMovie = await this.findOne(id);
        return {
            success: true,
            message: 'Movie updated successfully',
            statusCode: 200,
            // page: 0,
            // limit: 0,
            // total: 1,
            movie: updatedMovie.movie,
        };
    }

    async remove(id: number): Promise<ResponseDto> {
        const result = await this.movieRepository.delete(id);
        if (result.affected === 0) {
            return {
                success: false,
                message: 'Movie not found',
                statusCode: 404,
                // page: 0,
                // limit: 0,
                // total: 0,
                movie: null,
            };
        }
        return {
            success: true,
            message: 'Movie deleted successfully',
            statusCode: 200,
            // page: 0,
            // limit: 0,
            // total: 0,
            movie: null,
        };
    }
}
