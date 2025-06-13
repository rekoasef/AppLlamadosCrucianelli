import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Le decimos que busque la "tarjeta de acceso" (token) en la cabecera de la petición,
      // específicamente en el 'Bearer Token'.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Le decimos que no se preocupe por la expiración, Passport lo gestiona por nosotros.
      ignoreExpiration: false,
      // Usamos la MISMA palabra secreta que usamos para firmar el token. ¡Deben coincidir!
      secretOrKey: 'MI_PALABRA_SUPER_SECRETA_PARA_PROD',
    });
  }

  /**
   * Esta función se ejecuta AUTOMÁTICAMENTE una vez que Passport verifica que el token es válido.
   * El payload es la información que guardamos dentro del token al hacer login.
   * Lo que retornemos aquí, NestJS lo añadirá al objeto `request` del controlador.
   */
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
