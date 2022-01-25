import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LogInUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
