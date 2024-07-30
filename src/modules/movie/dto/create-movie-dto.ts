import { ApiProperty } from "@nestjs/swagger";

export class CreateMovieDto {
    @ApiProperty({ example: "Inception", description: 'Title of the movie' })
    readonly title: string;

    @ApiProperty({ example: 2010, description: 'Release year of the movie' })
    readonly year: number;

    @ApiProperty({ example: "https://example.com/poster.jpg", description: 'URL of the movie poster' })
    poster: string;
}
