import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/LoginDTO';
import { BadCredentialException } from 'src/exceptions/BadCredentialException';
import { GoogleAuthGuard } from 'src/common/guards/google.guard';
import { User } from 'src/user/schemas/user.schema';
import { UserNotFoundException } from 'src/exceptions/UserNotFoundException';
import { TokenInvalidException } from 'src/exceptions/TokenInvalidException';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginInDto: LoginDTO) {
    try {
      const response = await this.authService.logIn(loginInDto);
      return response;
    } catch (error) {
      if (error instanceof BadCredentialException)
        throw new BadRequestException('Invalid email or password');
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    try {
      await this.authService.forgotPassword(body.email);
      return {
        statusCode: 200,
        message: 'Password reset link sent to your email',
      };
    } catch (error) {
      if (error instanceof UserNotFoundException)
        throw new BadRequestException('Invalid email');
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(
    @Body() body: { password: string },
    @Query('token') token: string,
  ) {
    try {
      await this.authService.resetPassword(token, body.password);
      return {
        statusCode: 200,
        message: 'Password reset successfully',
      };
    } catch (error) {
      if (error instanceof TokenInvalidException)
        throw new BadRequestException('Invalid token or token expired');
    }
  }

  @Get('verify-account')
  @HttpCode(HttpStatus.OK)
  async verifyAccount(@Query('token') token: string) {
    try {
      await this.authService.verifyAccount(token);
      return {
        statusCode: 200,
        message: 'Account verified successfully',
      };
    } catch (error) {
      if (error instanceof TokenInvalidException)
        throw new BadRequestException('Invalid token or token expired');
    }
  }

  @Post('verify-account')
  @HttpCode(HttpStatus.OK)
  async sendVerificationEmail(@Body() body: { email: string }) {
    try {
      await this.authService.sendVerificationEmail(body.email);
      return {
        statusCode: 200,
        message: 'Verification email sent successfully',
      };
    } catch (error) {
      if (error instanceof UserNotFoundException)
        throw new BadRequestException(
          'Invalid email or email already verified',
        );
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback(@Req() req: any, @Res() res: any) {
    if (!req.user) return;
    const CLIENT_URL = process.env.CLIENT_REDIRECT_URL;
    const token = req.user.accessToken;
    res.redirect(`${CLIENT_URL}?token=${token}`);
  }
}
