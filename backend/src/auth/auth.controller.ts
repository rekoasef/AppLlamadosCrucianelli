import { Controller, Post, Body, UnauthorizedException, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport'; // Importar el Guard

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>) {
    const user = await this.authService.validateUser(
      signInDto.email,
      signInDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.authService.login(user);
  }

  // --- NUEVA RUTA PROTEGIDA ---
  @UseGuards(AuthGuard('jwt')) // <-- Este es el "lector de tarjetas". Si no es válida, bloquea el acceso.
  @Get('profile')
  getProfile(@Request() req) {
    // Si el token es válido, la estrategia (JwtStrategy) ya hizo su trabajo
    // y NestJS ha puesto los datos del usuario en req.user.
    // Simplemente devolvemos esa información.
    return req.user;
  }
}
