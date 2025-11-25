import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './application/users.service';
import { UserEntity } from './infrastructure/typeorm/user.entity';
import { UsersRepositoryProvider } from './infrastructure/typeorm/users.repository';
import { UsersController } from './interface/http/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepositoryProvider]
})
export class UsersModule {}
