import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination(req, file, callback) {
          callback(null, '../server/images');
        },
        filename(req, file, callback) {
          callback(null, Date.now() + '-' + file.originalname);
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [],
})
export class UploadModule {}
