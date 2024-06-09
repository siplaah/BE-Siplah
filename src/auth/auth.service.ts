import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { EmployeeService } from 'src/employee/employee.service';
import { JwtService } from '@nestjs/jwt';
// import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  private readonly blacklist: Set<string> = new Set();

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

      const namaJabatan = await this.employeeService.getNamaJabatanById(
        employee.id_jabatan,
      );

      const accessToken = this.jwtService.sign({
        employee: {
          id: employee.id_employee,
          name: employee.name,
          email: employee.email,
          jabatan: namaJabatan,
        },
      });
      return {
        accessToken,
        employee: {
          id: employee.id_employee,
          name: employee.name,
          email: employee.email,
          jabatan: namaJabatan,
        },
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async logout(token: string) {
    this.blacklist.add(token);
  }

  isBlacklisted(token: string): boolean {
    return this.blacklist.has(token);
  }
}
