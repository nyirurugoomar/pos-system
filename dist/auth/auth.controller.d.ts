import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup';
import { SignInDto } from './dto/signin';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(signUpDto: SignUpDto): Promise<{
        token: string;
        user: any;
    }>;
    signIn(signInDto: SignInDto): Promise<{
        token: string;
        user: any;
    }>;
    getProfile(req: any): Promise<any>;
    refreshToken(req: any): Promise<{
        token: string;
    }>;
    changePassword(req: any, body: {
        oldPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
}
