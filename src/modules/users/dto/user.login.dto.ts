import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class LoginUserDTO {
    @ApiProperty({ example: "example@gmail.com", description: 'Email of the user' })
    @IsString()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ example: "password", description: 'password' })
    @IsString()
    @Length(8, 20)
    readonly password: string;

}