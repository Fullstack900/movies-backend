import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDTO } from "./dto/user.dto";
import { AuthGuard } from "@nestjs/passport";
import { LoginUserDTO } from "./dto/user.login.dto";
import { CurrentUser } from "./decorator/current-user.decorator";
import { UserEntity } from "./entities/users.entity";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
// import { EntityNotFoundExceptionFilter } from "src/filters/entity-not-found-exception.filter";
// import { HttpExceptionFilter } from "src/filters/http-exception.filter";

@ApiTags('Users')
@Controller('users')
// @UseFilters(EntityNotFoundExceptionFilter)
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }

    @Post('/login')
    @ApiOperation({
        description:
            '### This operation will login in the user',
        summary: 'Sign in.',
    })
    async loginUser(@Body() user: LoginUserDTO) {
        return await this.userService.loginUser(user)
    }

    @Post('/')
    @ApiOperation({
        description:
            '### This operation will sing up the user',
        summary: 'Create new user.',
    })
    async createUser(@Body() user: CreateUserDTO) {
        return await this.userService.createUser(user)
    }
}
