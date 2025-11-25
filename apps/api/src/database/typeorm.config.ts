import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { UserEntity } from '../users/infrastructure/typeorm/user.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    type DatabaseType = 'mysql' | 'sqlite';
    const type = (this.configService.get<string>('DATABASE_TYPE') as DatabaseType) ?? 'mysql';
    const isTestEnv = this.configService.get<string>('NODE_ENV') === 'test';
    const synchronize =
      this.configService.get<string>('DATABASE_SYNCHRONIZE') === 'true' || isTestEnv;

    if (type === 'sqlite') {
      const sqliteOptions: TypeOrmModuleOptions = {
        type,
        database: this.configService.get<string>('DATABASE_DATABASE', ':memory:'),
        entities: [UserEntity],
        synchronize,
        logging: false
      };
      return sqliteOptions;
    }

    const mysqlOptions: TypeOrmModuleOptions = {
      type,
      host: this.configService.get<string>('DATABASE_HOST', 'localhost'),
      port: Number(this.configService.get<string>('DATABASE_PORT', '3306')),
      username: this.configService.get<string>('DATABASE_USER', 'webapp'),
      password: this.configService.get<string>('DATABASE_PASSWORD', 'webapp'),
      database: this.configService.get<string>('DATABASE_NAME', 'webapp'),
      entities: [UserEntity],
      synchronize,
      logging: false
    };

    return mysqlOptions;
  }
}
