import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from '../schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
    ) { }

    async validateOAuthLogin(profile: any): Promise<{ user: User; token: string }> {
        const { googleId, email, name, picture } = profile;

        // Find or create user
        let user = await this.userModel.findOne({ googleId });

        if (!user) {
            user = new this.userModel({
                googleId,
                email,
                name,
                picture,
            });
            await user.save();
        } else {
            // Update user info in case it changed
            user.email = email;
            user.name = name;
            user.picture = picture;
            await user.save();
        }

        // Generate JWT token
        const payload = { sub: user._id, email: user.email, name: user.name };
        const token = this.jwtService.sign(payload);

        return { user, token };
    }

    async getUserById(userId: string): Promise<User> {
        return this.userModel.findById(userId);
    }
}
