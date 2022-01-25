import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from '../user/user.entity';
import { LogInUserDto } from './dto/log-in-user.dto';
import { LogOutUserDto } from './dto/log-out-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  public async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Partial<UserEntity>> {
    const { password, ...restNewUserData } = await this.authService.signUp(
      createUserDto,
    );

    return restNewUserData;
  }

  @Post('log-in')
  public async logIn(
    @Body() loginUserDto: LogInUserDto,
  ): Promise<Partial<UserEntity>> {
    const { password, ...restUserData } = await this.authService.logIn(
      loginUserDto,
    );

    return restUserData;
  }

  @Post('log-out')
  public async logOut(@Body() logoutUserDto: LogOutUserDto): Promise<string> {
    await this.authService.logOut(logoutUserDto);

    return 'User logged out';
  }
}
