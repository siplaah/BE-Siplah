import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { EmployeeService } from 'src/employee/employee.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    try {
      const employee = await this.employeeService.verifyPassword(
        signInDto.email,
        signInDto.password,
      );
      const accessToken = await this.jwtService.sign({
        employee: {
          id: employee.id_employee,
          name: employee.name,
          email: employee.email,
        },
      });
      return {
        accessToken,
        employee: {
          id: employee.id_employee,
          name: employee.name,
          email: employee.email,
        },
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
