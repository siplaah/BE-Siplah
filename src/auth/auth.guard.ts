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
    try {
      const payload = await this.validateRequest(request);
      if (!payload) {
        return false; // Return false if payload not found
      }
      console.log('Payload:', payload);
      request['employee'] = payload.employee;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async validateRequest(req: Request) {
    const header = req.headers['authorization'];
    if (!header) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = header.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    // Check if token is blacklisted
    if (this.authService.isBlacklisted(token)) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    const payload = await this.jwtService.verifyAsync(token);
    console.log('Verified Token Payload:', payload); // Log verified token payload
    return payload;
  }
}
