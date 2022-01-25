import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import * as fs from 'fs/promises';

import { ImageRepository } from './image.repository';
import { UploadImageDto } from './dto/upload-image.dto';
import { ImageEntity } from './image.entity';
import { In } from 'typeorm';

@Injectable()
export class ImageService {
  private IMAGES_DIRECTORY = '/../../src/image/storage';

  constructor(
    @InjectRepository(ImageRepository) private imageRepository: ImageRepository,
  ) {}

  public async uploadImage(
    uploadImageDto: UploadImageDto,
    image: Express.Multer.File,
  ): Promise<ImageEntity> {
    const imageNameAndExtension = image.originalname.split('.');
    const imagePath = `${path.join(__dirname, this.IMAGES_DIRECTORY)}/${
      imageNameAndExtension[0]
    }-${new Date().getTime()}.${imageNameAndExtension[1]}`;

    const newImageEntity = this.imageRepository.create({
      name: image.originalname,
      portfolioId: uploadImageDto.portfolioId,
      imageDescription: uploadImageDto.description,
      imagePath,
    });
    let newImage: ImageEntity;

    try {
      newImage = await this.imageRepository.save(newImageEntity);
    } catch (error) {
      if (error.code === '23503') {
        const errorData = error.detail.match(/(?<=\().*?(?=\))/gm);

        throw new BadRequestException(
          `${errorData[0]} with value ${errorData[1]} does not exist`,
        );
      }

      throw new BadRequestException(error.message);
    }

    try {
      await fs.writeFile(imagePath, image.buffer);
    } catch (error) {
      await this.imageRepository.delete(newImage.id);

      throw new BadRequestException(error.message);
    }

    return newImage;
  }

  public async deleteImage(id: number) {
    const existedImage = await this.imageRepository.findOne({
      id,
    });

    if (!existedImage) {
      throw new NotFoundException('Image with given id not found');
    }

    const deleteResult = await this.imageRepository.delete({
      id,
    });

    if (deleteResult.affected === 0) {
      throw new BadRequestException('Error during deleting the image');
    }

    await fs.unlink(existedImage.imagePath);
  }

  public async findAllPortfoliosImages(
    portfoliosIds: number[],
  ): Promise<ImageEntity[]> {
    return await this.imageRepository.find({
      where: { portfolioId: In(portfoliosIds) },
    });
  }
}
