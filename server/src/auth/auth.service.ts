import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, pass: string): Promise<{ access_token: string }> {
    const checkEmail = await this.userService.findEmail(email);

    if (!checkEmail) {
      return null;
    }

    const checkPassword = await bcrypt.compare(pass, checkEmail.password);

    if (!checkPassword) {
      return null;
    }

    const { ...rest }: any = checkEmail;
    const { password, ...result } = rest._doc;
    password;

    return {
      access_token: this.jwtService.sign(result),
    };
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
