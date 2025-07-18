import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';

export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsEnum(['user', 'cashier', 'manager', 'admin'])
    role: string = 'user';
}