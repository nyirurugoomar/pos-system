import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';
import { SignUpDto } from './dto/signup';
import { SignInDto } from './dto/signin';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService,
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<{ token: string; user: any }> {
        const { username, password, email, role } = signUpDto;

        // Check if user already exists
        const existingUser = await this.userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            throw new ConflictException('User with this username or email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await this.userModel.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'user', // Default role if not provided
        });

        // Generate JWT token
        const token = this.jwtService.sign({
            userId: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        });

        // Return token and user info (without password)
        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        };

        return { token, user: userResponse };
    }

    async signIn(signInDto: SignInDto): Promise<{ token: string; user: any }> {
        const { username, password } = signInDto;

        // Find user by username
        const user = await this.userModel.findOne({ username });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate JWT token
        const token = this.jwtService.sign({
            userId: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        });

        // Return token and user info (without password)
        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        };

        return { token, user: userResponse };
    }

    async validateUser(userId: string): Promise<any> {
        const user = await this.userModel.findById(userId).select('-password');
        return user;
    }

    async refreshToken(userId: string): Promise<{ token: string }> {
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const token = this.jwtService.sign({
            userId: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        });

        return { token };
    }

    async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{ message: string }> {
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Verify old password
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isOldPasswordValid) {
            throw new UnauthorizedException('Invalid old password');
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await this.userModel.findByIdAndUpdate(userId, {
            password: hashedNewPassword,
        });

        return { message: 'Password changed successfully' };
    }

    async getUserProfile(userId: string): Promise<any> {
        const user = await this.userModel.findById(userId).select('-password');

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user;
    }
}