import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import { LogInUserDto } from './dto/log-in-user.dto';
import { LogOutUserDto } from './dto/log-out-user.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  public async signUp(createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.userService.createUser(createUserDto);
  }

  public async logIn(loginUserDto: LogInUserDto) {
    const existedUser = await this.userService.getUserByEmail(
      loginUserDto.email,
    );

    if (await bcrypt.compare(loginUserDto.password, existedUser.password)) {
      if (!existedUser.isLogged) {
        return await this.userService.updateUser(existedUser.id, {
          isLogged: true,
        });
      } else {
        throw new BadRequestException('User is logged in already');
      }
    } else {
      throw new BadRequestException('Incorrect password');
    }
  }

  public async logOut(logOutUserDto: LogOutUserDto) {
    const existedUser = await this.userService.getUserByEmail(
      logOutUserDto.email,
    );

    if (existedUser.isLogged) {
      await this.userService.updateUser(existedUser.id, {
        isLogged: false,
      });
    } else {
      throw new BadRequestException('User is logged out already');
    }
  }

  public async isUserLoggedIn(userId: number): Promise<boolean> {
    const existedUser = await this.userService.getUserById(userId);

    return existedUser.isLogged;
  }
}
