import { IsString, IsNotEmpty, IsNumber, IsArray, IsObject } from 'class-validator';

export class ProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsNotEmpty()
    image: string;

    
    
    
    
}