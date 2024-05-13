import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './auth.guard';
import { JwtPayload } from './types/jwt-payload.type';
import { ResponseEntity } from 'src/common/entity/response.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  public async signIn(@Body() body: SignInDto) {
    try {
      return new ResponseEntity(await this.authService.signIn(body));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Get('me')
  public async me(@Req() req: Request & { employee: JwtPayload }) {
    return req.employee;
  }
}
