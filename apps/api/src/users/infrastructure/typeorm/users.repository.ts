import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/user';
import { USERS_REPOSITORY, UsersRepositoryPort } from '../../domain/users.repository.port';
import { UserEntity } from './user.entity';

@Injectable()
export class TypeOrmUsersRepository implements UsersRepositoryPort {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>
  ) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? { id: entity.id } : null;
  }
}

export const UsersRepositoryProvider = {
  provide: USERS_REPOSITORY,
  useClass: TypeOrmUsersRepository
};
