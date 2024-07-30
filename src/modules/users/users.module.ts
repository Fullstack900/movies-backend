import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
        useFactory: () => ({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '1w' } })
    })
    ],
    providers: [UserService, LocalStrategy, JwtStrategy],
    controllers: [UserController],

})
export class UserModule { }