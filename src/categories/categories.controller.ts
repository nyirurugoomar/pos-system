import { Controller,Post,Body,Param,Put,Get,Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './schemas/categories.schema';
import { CategoryDto } from './dto/categories';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    async createCategory(@Body() category: CategoryDto): Promise<Category> {
        return this.categoriesService.createCategory(category);
    }

    @Get()
    async getCategories():Promise<Category[]>{
        return this.categoriesService.getCategories()
    }

    @Get(':id')
    async getCategoryById(@Param('id') id: string):Promise<Category>{
        return this.categoriesService.getCategoryById(id)
    }
    
    @Put(':id')
    async updateCategory(@Param('id') id: string, @Body() category: CategoryDto):Promise<Category>{
        return this.categoriesService.updateCategory(id, category)
    }

    @Delete(':id')
    async deleteCategory(@Param('id') id: string):Promise<Category>{
        return this.categoriesService.deleteCategory(id)
    }
    
}
