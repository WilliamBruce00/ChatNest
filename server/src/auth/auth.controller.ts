import {
  Controller,
  Get,
  Headers,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  login(@Request() req) {
    return this.authService.login(req.body.email, req.body.password);
  }

  @Get('/status')
  verifyToken(@Headers() headers: any) {
    const { authorization } = headers;
    const token = authorization.split(' ')[1];

    return this.authService.verifyToken(token);
  }
}
