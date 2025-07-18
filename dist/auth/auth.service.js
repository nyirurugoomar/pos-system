"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const user_schema_1 = require("./schemas/user.schema");
let AuthService = class AuthService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async signUp(signUpDto) {
        const { username, password, email, role } = signUpDto;
        const existingUser = await this.userModel.findOne({
            $or: [{ username }, { email }]
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this username or email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userModel.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'user',
        });
        const token = this.jwtService.sign({
            userId: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        });
        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        };
        return { token, user: userResponse };
    }
    async signIn(signInDto) {
        const { username, password } = signInDto;
        const user = await this.userModel.findOne({ username });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const token = this.jwtService.sign({
            userId: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        });
        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        };
        return { token, user: userResponse };
    }
    async validateUser(userId) {
        const user = await this.userModel.findById(userId).select('-password');
        return user;
    }
    async refreshToken(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const token = this.jwtService.sign({
            userId: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        });
        return { token };
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid old password');
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.userModel.findByIdAndUpdate(userId, {
            password: hashedNewPassword,
        });
        return { message: 'Password changed successfully' };
    }
    async getUserProfile(userId) {
        const user = await this.userModel.findById(userId).select('-password');
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map