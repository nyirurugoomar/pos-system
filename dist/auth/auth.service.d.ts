import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from './schemas/user.schema';
import { SignUpDto } from './dto/signup';
import { SignInDto } from './dto/signin';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<User>, jwtService: JwtService);
    signUp(signUpDto: SignUpDto): Promise<{
        token: string;
        user: any;
    }>;
    signIn(signInDto: SignInDto): Promise<{
        token: string;
        user: any;
    }>;
    validateUser(userId: string): Promise<any>;
    refreshToken(userId: string): Promise<{
        token: string;
    }>;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    getUserProfile(userId: string): Promise<any>;
}
