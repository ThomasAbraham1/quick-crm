import { Controller, Get, Req, Res, UseGuards, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) { }

    // Step 1: User clicks "Sign in with Google" -> redirects to Google
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {
        // Guard handles the redirect to Google
    }

    @Post('logout')
    async logout(@Res() res) {
        res.clearCookie('token');
        res.redirect(`${this.configService.get<string>('FRONTEND_URL')}/login`);
    }

    // Step 2: Google redirects back here with user data
    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Req() req, @Res() res) {
        // Validate OAuth login and generate JWT
        const { token } = await this.authService.validateOAuthLogin(req.user);

        // Set httpOnly cookie (more secure than URL token)
        res.cookie('token', token, {
            httpOnly: true,  // Prevents JavaScript access (XSS protection)
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'lax', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Redirect to frontend without token in URL
        const frontendUrl = this.configService.get<string>('FRONTEND_URL');
        res.redirect(`${frontendUrl}`);
    }

    // Get current logged-in user info
    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req) {
        // console.log(req.user);
        return req.user;
    }
}
