import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { PortfolioEntity } from './portfolio.entity';

@Controller('portfolios')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Post('create-portfolio')
  public async createPortfolio(
    @Body() createPortfolioDto: CreatePortfolioDto,
  ): Promise<PortfolioEntity> {
    return await this.portfolioService.createPortfolio(createPortfolioDto);
  }

  @Delete('delete-portfolio/:id')
  public async deletePortfolio(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string> {
    await this.portfolioService.deleteUserPortfolios({
      id,
    });

    return 'Portfolio has been deleted successfully';
  }
}
