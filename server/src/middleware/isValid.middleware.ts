import { Injectable, NestMiddleware } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class isValidMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: Error | any) => void) {
    const isValid = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isValid) {
      return res.status(400).json({ message: 'Id invalid' });
    }

    return next();
  }
}
