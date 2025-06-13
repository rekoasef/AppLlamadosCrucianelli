import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Valida si un usuario y contraseña son correctos.
   * @param email Email del usuario
   * @param pass Contraseña en texto plano
   * @returns El objeto del usuario si es válido, si no, null.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    // Comparamos la contraseña que nos llega con la que está hasheada en la BD
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user; // Quitamos el password del objeto que devolvemos
      return result;
    }
    return null;
  }

  /**
   * Genera el token de acceso (JWT) para un usuario.
   * @param user Objeto del usuario
   * @returns Un objeto con el token de acceso.
   */
  async login(user: any) {
    // El payload es la información que guardaremos dentro del token.
    // No guardes información sensible aquí.
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
