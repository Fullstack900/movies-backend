import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy } from "passport-local";
import { UserEntity } from "../entities/users.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt'
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {
        super()
    }

    public validate = async (email: string, password: string): Promise<any> => {
        const user = await this.userRepository.findOne({ where: { email: email } })

        if (!user) {
            throw new UnauthorizedException()
        }

        if (!(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException();
        }

        return user
    }

}