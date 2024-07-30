import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Movie } from "src/modules/movie/entities/movie/movie";
import { UserEntity } from "src/modules/users/entities/users.entity";

const ormConfig = (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    connectTimeout: 10000,
    database: process.env.DATABASE_DATABASE,
    entities: [UserEntity, Movie],
    synchronize: true,
    // logging: true,
    // migrationsRun: false,
});

export default ormConfig;
