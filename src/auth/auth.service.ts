import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDTO } from './dto/LoginDTO';
import * as bcrypt from 'bcrypt';
import { BadCredentialException } from 'src/exceptions/BadCredentialException';
import { User } from 'src/user/schemas/user.schema';
import { MailService } from 'src/mail/mail.service';
import { TokenInvalidException } from 'src/exceptions/TokenInvalidException';
import { UserNotFoundException } from 'src/exceptions/UserNotFoundException';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}
  async logIn(
    loginDTO: LoginDTO,
  ): Promise<{ access_token: string; user: User }> {
    const { email, password } = loginDTO;
    const user = await this.userService.findByEmail(email);
    if (
      !user ||
      !user.password ||
      !(await bcrypt.compare(password, user.password))
    ) {
      throw new BadCredentialException();
    }
    const payload = { sub: user.email };
    const token = await this.jwtService.signAsync(payload);
    user.password = undefined;
    return {
      access_token: token,
      user,
    };
  }

  async validateGoogleUser(googleUser: any) {
    const { email, name, googleId } = googleUser;
    let user = await this.userService.findByEmail(email);

    if (!user) {
      user = await this.userService.createGoogleUser(email, name, googleId);
    }

    const payload = { sub: user.email };
    const token = await this.jwtService.signAsync(payload);
    user.password = undefined;

    return {
      accessToken: token,
      user,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UserNotFoundException('Invalid email address!');
    }
    const token = await this.userService.generateResetToken(user.email);
    this.mailService.sendResetPasswordEmail(user.email, token);
  }
  async resetPassword(token: string, password: string) {
    const user = await this.userService.verifyResetToken(token);
    if (!user) {
      throw new TokenInvalidException(
        'Invalid reset password token or expired',
      );
    }
    await this.userService.updatePassword(user.email, password);
  }
}
