import { IsString, IsNotEmpty } from 'class-validator';

export class CategoryDto {
    @IsString()
    @IsNotEmpty()
    categoryName: string;

}