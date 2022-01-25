import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';

import { UserService } from './user.service';
import { UserEntity } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Delete('delete-user/:id')
  public async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string> {
    return await this.userService.deleteUser(id);
  }

  @Get('image-feed/:userId')
  public async imageFeed(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserEntity> {
    return await this.userService.getUserById(userId, [
      'portfolios',
      'portfolios.images',
    ]);
  }
}
