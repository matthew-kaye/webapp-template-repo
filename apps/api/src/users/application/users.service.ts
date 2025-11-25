import { Inject, Injectable } from '@nestjs/common';
import { User } from '../domain/user';
import { USERS_REPOSITORY, UsersRepositoryPort } from '../domain/users.repository.port';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryPort
  ) {}

  async getUser(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }
}
