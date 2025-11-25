import { mock } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from '../../application/users.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  const userId = 'user-1';

  it('returns the user when found', async () => {
    const service = mock<UsersService>();
    service.getUser.mockResolvedValue({ id: userId });
    const controller = new UsersController(service);

    const response = await controller.getUser(userId);

    expect(response).toEqual({ id: userId });
    expect(service.getUser).toHaveBeenCalledWith(userId);
  });

  it('throws NotFoundException when user is missing', async () => {
    const service = mock<UsersService>();
    service.getUser.mockResolvedValue(null);
    const controller = new UsersController(service);

    await expect(controller.getUser(userId)).rejects.toBeInstanceOf(NotFoundException);
  });
});
