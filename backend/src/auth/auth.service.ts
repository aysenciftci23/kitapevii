import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(userData: any) {
    const existingUser = await this.usersService.findOneByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('Bu email adresi zaten kullanımda.');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    });

    const { password, ...result } = user;
    return result;
  }

  async login(loginData: any) {
    const user = await this.usersService.findOneByEmail(loginData.email);
    if (!user) {
      throw new UnauthorizedException('Geçersiz email veya şifre.');
    }

    const isPasswordMatching = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Geçersiz email veya şifre.');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
