import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './strategy/google.strategy';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UserModule,
    JwtModule.register({
      global: true,
      signOptions: {
        expiresIn: '1d',
      },
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [AuthService, GoogleStrategy, MailService],
  controllers: [AuthController],
})
export class AuthModule {}
