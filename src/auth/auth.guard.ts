import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

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
    return this.jwtService.verifyAsync(token);
  }
}
