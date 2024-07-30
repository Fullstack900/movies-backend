import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/users.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateUserDTO } from "./dto/user.dto";
import * as bcrypt from 'bcrypt'
import { JwtService } from "@nestjs/jwt";
import { LoginUserDTO } from "./dto/user.login.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService
    ) { }


    private getUserBaseQuery(alias: string): SelectQueryBuilder<UserEntity> {
        return this.userRepository.createQueryBuilder(alias)
        // .leftJoinAndSelect(`${alias}.role`, 'role')
    }

    transformUser(user: UserEntity | UserEntity[]): any | any[] {
        if (Array.isArray(user)) {
            return user.map(u => this.transformSingleUser(u));
        } else {
            return this.transformSingleUser(user);
        }
    }
    private transformSingleUser(user: UserEntity): any {
        return {
            id: user.id,
            email: user.email,

        };
    }



    public getUsers = async (): Promise<{ success: boolean, statusCode: number, data: any | null }> => {
        const query = await this.getUserBaseQuery("u").getMany()

        const transformedUser = this.transformUser(query);
        return {
            success: true,
            statusCode: 200,
            data: transformedUser
        };
    }

    public getUser = async (id: number): Promise<{ success: boolean, statusCode: number, data: any | null }> => {

        try {
            const query = await this.getUserBaseQuery("u").andWhere('u.id = :id', { id }).getOne();
            if (!query) {
                return { success: false, statusCode: 404, data: null };
            }
            const transformedUser = this.transformUser(query);
            return {
                success: true,
                statusCode: 200,
                data: transformedUser
            };
        } catch (error) {
            throw new BadRequestException(`Error fetching user: ${error.message}`);
        }
    };


    private generatePassword = async (password: string): Promise<string> => {
        const salt = 10
        return await bcrypt.hash(password, salt)
    }


    private generateToken = (user: UserEntity, expiration?: string): string => {
        const payload = { sub: user?.id }

        return this.jwtService.sign(payload, expiration && { expiresIn: '10m' })
    }

    public loginUser = async (payload: LoginUserDTO): Promise<{ success: boolean, statusCode: number, user: any }> => {

        try {
            const user = await this.getUserBaseQuery("u")
                .where('u.email = :email', { email: payload.email })
                .getOne();
            if (!user || !(await bcrypt.compare(payload.password, user.password))) {
                throw new NotFoundException(`user not found`);
            }
            const allUsers = this.transformUser(user);
            return {
                success: true,
                statusCode: 200,
                user: { ...allUsers, auth_token: this.generateToken(user) }
            };
        } catch (error) {
            console.log("🚀 ~ UserService ~ loginUser= ~ error:", error.message)

            throw new BadRequestException(`${error.message}`);
        }
    }

    public createUser = async (user: CreateUserDTO): Promise<{ success: boolean, statusCode: number, data: any }> => {

        try {

            const existingUser = await this.userRepository.findOne({
                where: [
                    { email: user.email },
                ],
            });

            if (existingUser) {
                throw new BadRequestException('user already exist with this email')
            }

            const newUser = this.userRepository.create({
                email: user.email,
                password: await this.generatePassword(user.password),
            });

            const createdUser = this.transformUser(await this.userRepository.save(newUser));
            return {
                success: true,
                statusCode: 201,
                data: { ...createdUser }
            };
        } catch (error) {
            console.log("🚀 ~ UserService ~ createUser= ~ error:", error)

            throw new BadRequestException(`${error.message}`);
        }
    }
}

