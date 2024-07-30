import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import ormConfig from "./orm.config";

export default registerAs('orm.config', (): TypeOrmModuleOptions => ({
    ...ormConfig(),
}));
