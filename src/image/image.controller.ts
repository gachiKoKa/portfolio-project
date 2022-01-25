import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ImageService } from './image.service';
import { UploadImageDto } from './dto/upload-image.dto';
import { ImageEntity } from './image.entity';

@Controller('images')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  public async uploadImage(
    @Body() uploadImageDto: UploadImageDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImageEntity> {
    return await this.imageService.uploadImage(
      {
        description: uploadImageDto.description,
        userId: Number(uploadImageDto.userId),
        portfolioId: Number(uploadImageDto.portfolioId),
      },
      file,
    );
  }

  @Delete('delete-image/:id')
  public async deleteImage(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string> {
    await this.imageService.deleteImage(id);

    return 'Image has been successfully deleted';
  }
}
