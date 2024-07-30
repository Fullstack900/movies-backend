// movie/movie.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFile, Res, HttpException, HttpStatus, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie-dto';
import { UpdateMovieDto } from './dto/update-movie-dto';
import { ResponseDto } from './dto/response-dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@ApiTags('Movies')
@Controller('movies')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MovieController {
    constructor(
        private readonly movieService: MovieService,
        private readonly fileUploadService: FileUploadService,
    ) { }

    // @Post()
    // @ApiOperation({ summary: 'Create a new movie' })
    // @ApiResponse({ status: 201, description: 'The movie has been successfully created.', type: ResponseDto })
    // @ApiResponse({ status: 400, description: 'Bad Request.' })
    // create(@Body() createMovieDto: CreateMovieDto) {
    //     return this.movieService.create(createMovieDto);
    // }


    @Post()
    @ApiOperation({ summary: 'Create a new movie' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Poster image file and movie data',
        required: true,
        type: 'multipart/form-data',
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                years: { type: 'number' },
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async create(@Body() createMovieDto: CreateMovieDto, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new HttpException('File upload failed', HttpStatus.BAD_REQUEST);
        }
        const uploadResult = await this.fileUploadService.upload(file);
        createMovieDto.poster = uploadResult.Location;
        return this.movieService.create(createMovieDto);
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve all movies with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
    @ApiResponse({ status: 200, description: 'List of movies with pagination.', type: ResponseDto })
    @ApiResponse({ status: 404, description: 'Movies not found.' })
    findAll(@Query('page') page = 1, @Query('limit') limit = 8) {
        return this.movieService.findAll(page, limit);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a movie by ID' })
    @ApiParam({ name: 'id', type: 'number', description: 'ID of the movie' })
    @ApiResponse({ status: 200, description: 'The movie details.', type: ResponseDto })
    @ApiResponse({ status: 404, description: 'Movie not found.' })
    findOne(@Param('id') id: string) {
        return this.movieService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a movie by ID' })
    @ApiParam({ name: 'id', type: 'number', description: 'ID of the movie' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Poster image file and movie data',
        required: true,
        type: 'multipart/form-data',
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                years: { type: 'number' },
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto, @UploadedFile() file: Express.Multer.File) {
        if (file) {
            const uploadResult = await this.fileUploadService.upload(file);
            updateMovieDto.poster = uploadResult.Location;
        }
        if (Object.keys(updateMovieDto).length === 0) {
            throw new HttpException('No update values provided', HttpStatus.BAD_REQUEST);
        }
        const updatedMovie = await this.movieService.update(+id, updateMovieDto);
        return {
            success: true,
            message: 'Movie updated successfully',
            statusCode: 200,
            movie: updatedMovie.movie,
        };
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a movie by ID' })
    @ApiParam({ name: 'id', type: 'number', description: 'ID of the movie' })
    @ApiResponse({ status: 200, description: 'The movie has been successfully deleted.', type: ResponseDto })
    @ApiResponse({ status: 404, description: 'Movie not found.' })
    remove(@Param('id') id: string) {
        return this.movieService.remove(+id);
    }
}
