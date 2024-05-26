import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const payload = await this.validateRequest(request);
    request['employee'] = payload.employee;
    if (!payload) throw new UnauthorizedException();
    return true;
  }

  async validateRequest(req: Request) {
    const header = req.headers['authorization'];
    if (!header) throw new UnauthorizedException();
    const token = header.split(' ').at(1);

    // Check if token is blacklisted
    if (this.authService.isBlacklisted(token)) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    return this.jwtService.verifyAsync(token);
  }
}
