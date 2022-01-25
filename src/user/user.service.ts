import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

import { UserRepository } from './user.repository';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UserEntity } from './user.entity';

import { PortfolioService } from '../portfolio/portfolio.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private portfolioService: PortfolioService,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userEntity = this.userRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
      isLogged: true,
    });

    try {
      return await this.userRepository.save(userEntity);
    } catch (error) {
      if (error.code === '23505') {
        const errorData = error.detail.match(/(?<=\().*?(?=\))/gm);

        throw new BadRequestException(
          `${errorData[0]} with value ${errorData[1]} already exists`,
        );
      }
    }
  }

  public async updateUser(
    id: number,
    newUserData: Partial<UserEntity>,
  ): Promise<UserEntity> {
    const existedUser = await this.userRepository.findOne(id);

    if (!existedUser) {
      throw new NotFoundException('User not found');
    }

    const updateUserEntity = this.userRepository.create({
      ...existedUser,
      ...newUserData,
    });

    try {
      return await this.userRepository.save(updateUserEntity);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async deleteUser(id: number): Promise<string> {
    await this.portfolioService.deleteUserPortfolios({ userId: id });
    const deleteResult = await this.userRepository.delete({ id });

    if (deleteResult.affected === 0) {
      throw new BadRequestException(`Error during deleting user`);
    }

    return 'User has been deleted successfully';
  }

  public async getUserByEmail(email: string): Promise<UserEntity> {
    const existedUser = await this.userRepository.findOne({ email });

    if (!existedUser) {
      throw new NotFoundException(`User with given email ${email} not found`);
    }

    return existedUser;
  }

  public async getUserById(
    id: number,
    relations: string[] = [],
  ): Promise<UserEntity> {
    const existedUser = await this.userRepository.findOne({
      where: { id },
      ...(relations.length && { relations: relations }),
    });

    if (!existedUser) {
      throw new NotFoundException(`User with given id ${id} not found`);
    }

    return existedUser;
  }
}
