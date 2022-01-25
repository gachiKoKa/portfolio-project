import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PortfolioEntity } from '../portfolio/portfolio.entity';

@Entity('images')
export class ImageEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  imageDescription: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  imagePath: string;

  @Column({ type: 'integer', nullable: false })
  portfolioId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => PortfolioEntity,
    (portfolioEntity) => portfolioEntity.images,
    { onDelete: 'CASCADE' },
  )
  portfolio: PortfolioEntity;
}
