import { IsEmail } from 'class-validator';

export class LogOutUserDto {
  @IsEmail()
  email: string;
}
