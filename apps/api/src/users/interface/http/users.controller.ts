import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UsersService } from '../../application/users.service';
import { User } from '../../domain/user';

type UserResponse = Pick<User, 'id'>;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserResponse> {
    const user = await this.usersService.getUser(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return { id: user.id };
  }
}
