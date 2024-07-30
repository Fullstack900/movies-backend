import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto {
    @ApiProperty()
    success: boolean;

    @ApiProperty()
    message: string;

    @ApiProperty({ required: false })
    data?: any;

    @ApiProperty({ required: false })
    error?: any;

    @ApiProperty({ required: false })
    statusCode?: any;
}
