import { User } from './user';

export interface UsersRepositoryPort {
  findById(id: string): Promise<User | null>;
}

export const USERS_REPOSITORY = 'USERS_REPOSITORY';
