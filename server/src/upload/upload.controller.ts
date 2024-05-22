import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const httpServer = this.httpAdapterHost.httpAdapter.getHttpServer();
    const addressInfo = httpServer.address();
    const host =
      addressInfo.address === '::' ? 'localhost' : addressInfo.address;
    const port = addressInfo.port;

    return { img: `http://${host}:${port}/images/${file.filename}` };
  }
}
