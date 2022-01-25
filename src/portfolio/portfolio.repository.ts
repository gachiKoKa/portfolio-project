import { EntityRepository, Repository } from 'typeorm';

import { PortfolioEntity } from './portfolio.entity';

@EntityRepository(PortfolioEntity)
export class PortfolioRepository extends Repository<PortfolioEntity> {}
