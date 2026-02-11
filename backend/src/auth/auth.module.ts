import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
    imports: [
        // Import User model for database access
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

        // Configure Passport
        PassportModule.register({ defaultStrategy: 'jwt' }),

        // Configure JWT module
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const secret = configService.get<string>('JWT_SECRET') || 'your-secret-key-change-this';
                const expiresIn = configService.get('JWT_EXPIRATION') || '7d';
                return {
                    secret,
                    signOptions: { expiresIn },
                };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, GoogleStrategy, JwtStrategy],
    exports: [AuthService, JwtModule], // Export so other modules can use auth
})
export class AuthModule { }
