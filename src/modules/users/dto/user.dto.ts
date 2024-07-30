import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDTO {
    @ApiProperty({ example: "example@gmail.com", description: 'Email of the user' })
    readonly email: string;

    @ApiProperty({ example: "password", description: 'password' })
    readonly password: string;

}