import { Controller, Post, Body, Get, UseGuards, Request, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup';
import { SignInDto } from './dto/signin';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto);
    }

    @Post('signin')
    async signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        return this.authService.getUserProfile(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('refresh')
    async refreshToken(@Request() req) {
        return this.authService.refreshToken(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put('change-password')
    async changePassword(
        @Request() req,
        @Body() body: { oldPassword: string; newPassword: string }
    ) {
        return this.authService.changePassword(
            req.user.userId,
            body.oldPassword,
            body.newPassword
        );
    }
}