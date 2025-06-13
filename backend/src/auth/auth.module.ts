import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy'; // <-- 1. Importar la estrategia

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'MI_PALABRA_SUPER_SECRETA_PARA_PROD',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  // 2. Añadir la estrategia a la lista de "expertos" (providers)
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
