import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs/promises';

import { PortfolioRepository } from './portfolio.repository';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { PortfolioEntity } from './portfolio.entity';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(PortfolioRepository)
    private portfolioRepository: PortfolioRepository,
  ) {}

  public async createPortfolio(
    createPortfolioDto: CreatePortfolioDto,
  ): Promise<PortfolioEntity> {
    const newPortfolioEntity =
      this.portfolioRepository.create(createPortfolioDto);

    try {
      return await this.portfolioRepository.save(newPortfolioEntity);
    } catch (error) {
      throw new BadRequestException(
        `Error during creating portfolio: ${error.message}`,
      );
    }
  }

  public async deleteUserPortfolios(
    criteria: Partial<PortfolioEntity>,
  ): Promise<string> {
    const existedUserPortfolios = await this.portfolioRepository.find({
      where: criteria,
      relations: ['images'],
    });

    if (existedUserPortfolios.length) {
      await this.portfolioRepository.delete(
        existedUserPortfolios.map((portfolio) => portfolio.id),
      );

      for (let i = 0; i < existedUserPortfolios.length; i++) {
        if (existedUserPortfolios[i].images.length) {
          for (let j = 0; j < existedUserPortfolios[i].images.length; j++) {
            await fs.unlink(existedUserPortfolios[i].images[j].imagePath);
          }
        }
      }

      return 'Portfolios has been deleted successfully';
    }

    return 'There is no portfolios to delete';
  }
}
