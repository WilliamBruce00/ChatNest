import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: any, res: any, next: (error?: Error | any) => void) {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const isValid = await this.authService.verifyToken(token);

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    next();
  }
}
