import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendResetPasswordEmail(email: string, token: string) {
    const CLIENT_REDIRECT_URL = process.env.CLIENT_REDIRECT_URL;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset',
      from: 'Admin Movies App <admin@example.com>',
      html: `<p>Click <a href="${CLIENT_REDIRECT_URL}/reset-password?token=${token}">here</a> to reset your password</p>`,
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const CLIENT_REDIRECT_URL = process.env.CLIENT_REDIRECT_URL;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify Email',
      from: 'Admin Movies App <admin@example.com>',
      html: `<p>Click <a href="${CLIENT_REDIRECT_URL}/verify-account?token=${token}">here</a> to verify your account</p>`,
    });
  }
}
