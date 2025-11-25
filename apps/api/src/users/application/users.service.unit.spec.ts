import { mock } from 'jest-mock-extended';
import { User } from '../domain/user';
import { UsersRepositoryPort } from '../domain/users.repository.port';
import { UsersService } from './users.service';

describe('UsersService', () => {
  it('returns the user provided by the repository', async () => {
    const repository = mock<UsersRepositoryPort>();
    const service = new UsersService(repository);
    const user: User = { id: 'abc-123' };

    repository.findById.mockResolvedValue(user);

    const result = await service.getUser(user.id);

    expect(result).toEqual(user);
    expect(repository.findById).toHaveBeenCalledWith(user.id);
  });
});
